import React from 'react';
import { Box, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function EmptyState({ group, view }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: 320,
        border: '1px dashed #C5D5E8',
        borderRadius: 2,
        bgcolor: '#FAFCFF',
        mx: 2,
        mb: 3,
        p: 4,
      }}
    >
      <BarChartIcon sx={{ fontSize: 48, color: '#C5D5E8', mb: 2 }} />
      <Typography
        sx={{ fontSize: '1rem', fontWeight: 700, color: 'text.secondary', mb: 0.5 }}
      >
        {group} — {view}
      </Typography>
      <Typography sx={{ fontSize: '0.82rem', color: 'text.disabled', textAlign: 'center' }}>
        No data available for this view yet.<br />
        Connect your API to populate this page.
      </Typography>
    </Box>
  );
}
