// Matches the path in your Service.cds and setupProxy.js
const API_BASE_URL = '/api/nrfp';

/**
 * 1. Fetch the list of widget names to build the KPI grid
 */
export async function getWidgetNames(filters) {
  // CAP actions require a POST request
  const response = await fetch(`${API_BASE_URL}/getWidgetNames`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}) 
  });

  if (!response.ok) {
    throw new Error('Failed to fetch widget names');
  }

  const result = await response.json();
  
  // OData actions typically return the result inside a 'value' property
  return result.value || result;
}

/**
 * 2. Fetch specific KPI data and format it for the KpiCard
 */
export async function getWidgetDataSingle(name, filters) {
  // Build the payload matching the input parameters of your CAP action
  const payload = {
    widgetName: name,
    topGroup: filters.group,         // 'Group', 'CIB', 'WRB'
    displayUnit: filters.unit,       // '$m', '$bn'
    currencyType: filters.currency   // 'RFX', 'CFX'
  };

  const response = await fetch(`${API_BASE_URL}/getWidgetDataSingle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${name}`);
  }

  const result = await response.json();
  
  // CAP wraps the action return object in a 'value' property
  const actionData = result.value || result;

  // Handle errors sent gracefully by the CAP backend
  if (actionData.status && actionData.status.startsWith('error')) {
    throw new Error(actionData.status);
  }

  // Your CAP backend stringifies the data payload using JSON.stringify() in buildJson
  // We must parse it back into a usable JavaScript object here
  let parsedData = {};
  try {
    parsedData = JSON.parse(actionData.data);
  } catch (e) {
    console.error(`Failed to parse JSON for widget ${name}`, e);
  }

  // Pick the correct dataset based on the active currency toggle (RFX or CFX)
  const isCFX = filters.currency === 'CFX';
  const dataSet = isCFX ? parsedData.cfx : parsedData.rfx;

  // Fallback if data doesn't exist for a widget yet or backend returned an error structure
  if (!dataSet) {
    return {
      name: parsedData.widget || name,
      value: 0, 
      yoy: null,
      label: 'YTD Actuals', 
      subRows: []
    };
  }

  // Transform the backend model into the exact UI model expected by KpiCard.js
  return {
    name: parsedData.widget || name,
    value: dataSet.ytdActuals,
    yoy: dataSet.ytdYoy,
    label: 'YTD Actuals',
    subRows: [
      { 
        label: 'vs Budget', 
        value: dataSet.vsBudget, 
        yoy: null // Fiori design doesn't show YoY for 'vs Budget'
      },
      { 
        label: 'PQ Actuals', 
        value: dataSet.pqActuals, 
        yoy: dataSet.pqYoy 
      },
      { 
        label: 'FY Outlook', 
        value: dataSet.fyOutlook, 
        yoy: dataSet.fyYoy 
      }
    ]
  };
}

/**
 * 3. Placeholder for Chart Data
 * Update this later to point to your actual CAP backend endpoint for charts
 */
export async function getIncomeByProduct(filters) {
  // Mock data to prevent app from crashing while you build the backend
  return {
    categories: ['Banking', 'Markets', 'Transaction services'],
    series: [
      { name: 'FY Outlook', color: '#1565C0', data: [2.8, 4.0, 10.8] },
      { name: 'YTD', color: '#1E88E5', data: [2.1, -3.2, 10.1] },
      { name: 'FY Budget', color: '#90CAF9', data: [2.5, 3.5, 10.5] }
    ]
  };
}

/**
 * 4. Placeholder for Table Data
 * Update this later to point to your actual CAP backend endpoint for tables
 */
export async function getIncomeByCluster(filters) {
  // Mock data to prevent app from crashing while you build the backend
  return [
    { 
      id: 'all', 
      level: 0, 
      label: '(all)', 
      ytd: 9009164724.23, 
      yoyPct: 1.46, 
      q3Outlook: 2713863131.93, 
      fyOutlook: 9175025425.30 
    }
  ];
}







import React, { useState } from 'react';
import {
  Box, Grid, Typography,
  ToggleButton, ToggleButtonGroup,
  AppBar, Toolbar, Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useQuery } from '@tanstack/react-query';

import { getWidgetNames, getWidgetDataSingle } from './services/api';
import KpiCard         from './components/KpiCard';
import KpiCardSkeleton from './components/KpiCardSkeleton';
import ChartSection    from './components/ChartSection';
import TableSection    from './components/TableSection';
import EmptyState      from './components/EmptyState';

// ─── Config ────────────────────────────────────────────────────────────────
// These arrays drive all navigation rendering — add/remove items here only.
const GROUP_TABS = ['Group', 'CIB', 'WRB'];
const VIEW_TABS  = ['Overview', 'Trends'];
const UNIT_OPTS  = ['$m', '$bn'];
const CURR_OPTS  = ['RFX', 'CFX'];

// Pages that have real data. All others show <EmptyState />.
const PAGES_WITH_DATA = new Set(['Group|Overview']);

// ─── Individual KPI card with its own independent query ────────────────────
function MetricCardWrapper({ name, filters }) {
  const { data, isLoading, isError } = useQuery({
    queryKey:  ['widget', name, filters],
    queryFn:   () => getWidgetDataSingle(name, filters),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || isError || !data) return <KpiCardSkeleton />;
  return <KpiCard data={data} unit={filters.unit} />;
}

// ─── NavTab styled button ──────────────────────────────────────────────────
function NavTab({ label, active, onClick }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        px: 1.5, py: 0.5,
        border: 'none', borderRadius: 1, cursor: 'pointer',
        fontSize: '0.78rem', fontWeight: active ? 700 : 500,
        bgcolor: active ? 'primary.main' : 'transparent',
        color:   active ? '#fff' : 'text.secondary',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
        '&:hover': { bgcolor: active ? 'primary.dark' : '#F0F4F8' },
      }}
    >
      {label}
    </Box>
  );
}

// ─── ViewTab (Overview / Trends) ───────────────────────────────────────────
function ViewTab({ label, active, onClick }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        px: 1.5, py: 0.5,
        border: 'none', borderBottom: '2px solid',
        borderColor: active ? 'primary.main' : 'transparent',
        bgcolor: 'transparent', cursor: 'pointer',
        fontSize: '0.78rem', fontWeight: active ? 700 : 500,
        color: active ? 'primary.main' : 'text.secondary',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
        '&:hover': { color: 'primary.main' },
      }}
    >
      {label}
    </Box>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  // Navigation state
  // activeView persists when switching groups — matches the spec:
  // "the second selection should be as the older one until I manually change it"
  const [activeGroup, setActiveGroup] = useState('Group');    // default: Group
  const [activeView,  setActiveView]  = useState('Overview'); // default: Overview
  const [unit,        setUnit]        = useState('$m');       // default: $m
  const [currency,    setCurrency]    = useState('RFX');      // default: RFX

  // Filters object passed to every query — changing any value re-fetches
  const filters = { group: activeGroup, view: activeView, unit, currency };

  // Does the current page combination have real data?
  const pageKey    = `${activeGroup}|${activeView}`;
  const hasData    = PAGES_WITH_DATA.has(pageKey);

  // Dynamic header title: "Group | Financials Overview" or "CIB | Financials Trends" etc.
  const headerTitle = (
    <>
      <Typography component="span" sx={{ fontWeight: 400, color: 'text.secondary', fontSize: '1rem' }}>
        {activeGroup}&nbsp;|&nbsp;Financials&nbsp;
      </Typography>
      {activeView}
    </>
  );

  // Step 1: fetch widget names (only when page has data)
  const { data: widgetNames, isLoading: namesLoading } = useQuery({
    queryKey:  ['widgetNames', activeGroup],
    queryFn:   () => getWidgetNames(filters),
    staleTime: 5 * 60 * 1000,
    enabled:   hasData,
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* ── APP BAR ─────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky" elevation={0}
        sx={{ bgcolor: '#fff', borderBottom: '1px solid', borderColor: 'divider', zIndex: 1200 }}
      >
        <Toolbar
          disableGutters
          sx={{ minHeight: '50px !important', px: 2, gap: 1.5, flexWrap: 'wrap' }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, mr: 1 }}>
            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: 'text.disabled', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Aspire
            </Typography>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: 'primary.main', letterSpacing: '-0.02em' }}>
              FinSight
              <Typography component="span" sx={{ fontWeight: 400, color: 'text.secondary', fontSize: '0.92rem' }}>
                .Performance
              </Typography>
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ my: 0.8 }} />

          {/* Group tabs — switching group preserves the current view */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {GROUP_TABS.map((tab) => (
              <NavTab
                key={tab}
                label={tab}
                active={activeGroup === tab}
                onClick={() => setActiveGroup(tab)}
              />
            ))}
          </Box>

          <Box flex={1} />

          {/* View tabs — switching view preserves the current group */}
          <Box sx={{ display: 'flex', gap: 0 }}>
            {VIEW_TABS.map((v) => (
              <ViewTab
                key={v}
                label={v}
                active={activeView === v}
                onClick={() => setActiveView(v)}
              />
            ))}
          </Box>

          <Divider orientation="vertical" flexItem sx={{ my: 0.8 }} />

          {/* Unit toggle */}
          <ToggleButtonGroup
            exclusive size="small"
            value={unit}
            onChange={(_, v) => v && setUnit(v)}
          >
            {UNIT_OPTS.map((u) => (
              <ToggleButton key={u} value={u}>{u}</ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Currency toggle */}
          <ToggleButtonGroup
            exclusive size="small"
            value={currency}
            onChange={(_, v) => v && setCurrency(v)}
          >
            {CURR_OPTS.map((c) => (
              <ToggleButton key={c} value={c}>{c}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>

      {/* ── PAGE TITLE ──────────────────────────────────────────────────── */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <FilterListIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>
          {headerTitle}
        </Typography>
      </Box>

      {/* ── PAGE CONTENT ────────────────────────────────────────────────── */}
      {!hasData ? (
        // Empty state for pages without data (CIB Overview, WRB Overview, all Trends pages)
        <EmptyState group={activeGroup} view={activeView} />
      ) : (
        <>
          {/* KPI Grid — 12 cards, each with independent loading */}
          <Box sx={{ px: 2, pb: 1.5 }}>
            <Grid container spacing={1}>
              {namesLoading
                ? Array(12).fill(null).map((_, i) => (
                    <Grid item xs={6} sm={4} md={2} key={i}>
                      <KpiCardSkeleton />
                    </Grid>
                  ))
                : (widgetNames || []).map((name) => (
                    <Grid item xs={6} sm={4} md={2} key={name}>
                      <MetricCardWrapper name={name} filters={filters} />
                    </Grid>
                  ))}
            </Grid>
          </Box>

          {/* Bottom: Chart + Table */}
          <Box sx={{ px: 2, pb: 3 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={6}>
                <ChartSection filters={filters} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TableSection filters={filters} />
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
}
