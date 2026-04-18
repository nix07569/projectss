import React from 'react';
import { Card, CardContent, Skeleton, Box, Divider } from '@mui/material';

export default function KpiCardSkeleton() {
  return (
    <Card sx={{ height: '100%', minHeight: 178 }}>
      <CardContent sx={{ p: '13px 14px 10px !important' }}>
        {/* Title row */}
        <Box display="flex" justifyContent="space-between" mb={0.8}>
          <Skeleton animation="wave" width="55%" height={13} />
          <Skeleton animation="wave" variant="circular" width={13} height={13} />
        </Box>

        {/* Primary value */}
        <Box display="flex" alignItems="baseline" gap={1} mb={0.3}>
          <Skeleton animation="wave" width="50%" height={32} />
          <Skeleton animation="wave" width="22%" height={14} />
        </Box>

        {/* Sub-label */}
        <Skeleton animation="wave" width="38%" height={11} sx={{ mb: 1 }} />

        <Divider sx={{ my: '8px' }} />

        {/* 3 sub-rows */}
        {[0, 1, 2].map((i) => (
          <Box key={i} display="flex" justifyContent="space-between" mb={0.5}>
            <Skeleton animation="wave" width="44%" height={11} />
            <Skeleton animation="wave" width="30%" height={11} />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
