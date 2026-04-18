import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Skeleton,
  Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, Collapse,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useQuery } from '@tanstack/react-query';
import { getIncomeByCluster } from '../services/api';

function fmtNum(v) {
  if (!v && v !== 0) return '—';
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2) + 'M';
  return sign + abs.toFixed(2);
}

function YoyCell({ v }) {
  const isPos = v >= 0;
  return (
    <Typography
      sx={{ fontSize: '0.75rem', fontWeight: 700, color: isPos ? '#2E7D32' : '#C62828' }}
    >
      {isPos ? '+' : ''}{v.toFixed(2)}%
    </Typography>
  );
}

// Recursive row renderer
function ClusterRow({ row, allRows, expanded, onToggle, depth = 0 }) {
  const hasChildren = row.children && row.children.length > 0;
  const isExpanded = expanded.has(row.id);

  const childRows = hasChildren
    ? row.children.map((cid) => allRows.find((r) => r.id === cid)).filter(Boolean)
    : [];

  return (
    <>
      <TableRow hover sx={{ '& td': { py: '4px' } }}>
        <TableCell sx={{ pl: `${12 + depth * 18}px` }}>
          <Box display="flex" alignItems="center" gap={0.3}>
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={() => onToggle(row.id)}
                sx={{ p: 0, width: 18, height: 18, color: 'text.secondary' }}
              >
                {isExpanded ? (
                  <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
                ) : (
                  <KeyboardArrowRightIcon sx={{ fontSize: 14 }} />
                )}
              </IconButton>
            ) : (
              <Box sx={{ width: 18 }} />
            )}
            <Typography
              sx={{
                fontSize: '0.77rem',
                fontWeight: depth === 0 ? 700 : depth === 1 ? 600 : 400,
                color: depth === 0 ? 'text.primary' : depth === 1 ? '#334155' : '#64748B',
              }}
            >
              {row.label}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="right" sx={{ fontFamily: 'monospace', fontSize: '0.73rem' }}>
          {fmtNum(row.ytd)}
        </TableCell>
        <TableCell align="right">
          <YoyCell v={row.yoyPct} />
        </TableCell>
        <TableCell align="right" sx={{ fontFamily: 'monospace', fontSize: '0.73rem' }}>
          {fmtNum(row.q3Outlook)}
        </TableCell>
        <TableCell align="right" sx={{ fontFamily: 'monospace', fontSize: '0.73rem' }}>
          {fmtNum(row.fyOutlook)}
        </TableCell>
      </TableRow>

      {hasChildren && isExpanded &&
        childRows.map((child) => (
          <ClusterRow
            key={child.id}
            row={child}
            allRows={allRows}
            expanded={expanded}
            onToggle={onToggle}
            depth={depth + 1}
          />
        ))}
    </>
  );
}

// Dynamic column config — driven by data shape
const TABLE_COLUMNS = [
  { key: 'cluster',   label: 'Cluster',       align: 'left' },
  { key: 'ytd',       label: 'YTD',           align: 'right' },
  { key: 'yoyPct',    label: 'YoY%',          align: 'right' },
  { key: 'q3Outlook', label: "Q3'25 Outlook", align: 'right' },
  { key: 'fyOutlook', label: 'FY Outlook',    align: 'right' },
];

export default function TableSection({ filters }) {
  const [expanded, setExpanded] = useState(new Set(['all', 'am']));

  const { data: rows, isLoading } = useQuery({
    queryKey: ['incomeByCluster', filters],
    queryFn: () => getIncomeByCluster(filters),
    staleTime: 5 * 60 * 1000,
  });

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Top-level rows (level 0)
  const rootRows = rows ? rows.filter((r) => r.level === 0) : [];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '14px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.primary', mb: 1.2 }}>
          Income By Cluster
        </Typography>

        {isLoading ? (
          <Box flex={1}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} animation="wave" height={36} sx={{ mb: 0.4 }} />
            ))}
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {TABLE_COLUMNS.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rootRows.map((row) => (
                  <ClusterRow
                    key={row.id}
                    row={row}
                    allRows={rows}
                    expanded={expanded}
                    onToggle={toggle}
                    depth={0}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
