import React from 'react';
import {
  Card, CardContent, Typography, Box, Divider, Tooltip,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material/styles';

// Format a scaled number (already divided by 1m or 1bn) for display
function formatVal(v, unit) {
  if (v === null || v === undefined) return '—';
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs === 0) return '0.00';
  // If the scaled value itself is large (e.g. funded assets in $m = millions of millions)
  if (abs >= 1_000_000) {
    return sign + (abs / 1_000_000).toFixed(2) + (unit === '$bn' ? 'Q' : 'T');
  }
  if (abs >= 1_000) {
    return sign + (abs / 1_000).toFixed(2) + (unit === '$bn' ? 'T' : 'B');
  }
  return sign + abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function YoyBadge({ value, direction }) {
  const theme = useTheme();
  const isPos = direction === 'up';
  const color = isPos ? theme.palette.success.main : theme.palette.error.main;
  const Icon = isPos ? ArrowUpwardIcon : ArrowDownwardIcon;
  return (
    <Box component="span" display="inline-flex" alignItems="center" gap="1px">
      <Icon sx={{ fontSize: 11, color }} />
      <Typography
        component="span"
        sx={{ fontSize: '0.7rem', fontWeight: 700, color, lineHeight: 1 }}
      >
        {Math.abs(value).toFixed(2)}
      </Typography>
    </Box>
  );
}

function SubRow({ label, value, yoy, unit }) {
  const isNeg = yoy < 0;
  const yoyColor = isNeg ? '#C62828' : '#2E7D32';
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" py="2px">
      <Typography
        sx={{ fontSize: '0.67rem', color: 'text.secondary', whiteSpace: 'nowrap' }}
      >
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={0.5}>
        <Typography sx={{ fontSize: '0.67rem', fontWeight: 600, color: 'text.primary' }}>
          {formatVal(value, unit)}
        </Typography>
        {yoy !== null && yoy !== undefined && (
          <Typography
            sx={{ fontSize: '0.63rem', fontWeight: 700, color: yoyColor }}
          >
            ({isNeg ? '↓' : '↑'} {Math.abs(yoy).toFixed(2)})
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function KpiCard({ data, unit }) {
  const { name, value, yoy, direction, label, subRows } = data;

  return (
    <Card sx={{ height: '100%', minHeight: 178 }}>
      <CardContent sx={{ p: '13px 14px 10px !important', height: '100%' }}>
        {/* Title */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
          <Typography
            sx={{
              fontSize: '0.67rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.07em', color: 'text.secondary',
              lineHeight: 1.3, pr: 0.5,
            }}
          >
            {name}
          </Typography>
          <Tooltip title={`${name} — ${label}`} placement="top" arrow>
            <InfoOutlinedIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'pointer', flexShrink: 0 }} />
          </Tooltip>
        </Box>

        {/* Primary value + YoY badge */}
        <Box display="flex" alignItems="baseline" gap={0.7} mb={0.2}>
          <Typography
            sx={{ fontSize: '1.25rem', fontWeight: 800, color: 'text.primary', letterSpacing: '-0.03em', lineHeight: 1 }}
          >
            {formatVal(value, unit)}
          </Typography>
          <YoyBadge value={yoy} direction={direction} />
        </Box>

        {/* Sub-label e.g. "YTD Actuals (YoY)" */}
        <Typography sx={{ fontSize: '0.63rem', color: 'text.disabled', display: 'block', mb: 0.8 }}>
          {label}
        </Typography>

        <Divider sx={{ mb: 0.8 }} />

        {/* Dynamic sub-rows — driven entirely by data */}
        {(subRows || []).map((row, i) => (
          <SubRow key={i} label={row.label} value={row.value} yoy={row.yoy} unit={unit} />
        ))}
      </CardContent>
    </Card>
  );
}
