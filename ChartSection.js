import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { useQuery } from '@tanstack/react-query';
import { getIncomeByProduct } from '../services/api';

export default function ChartSection({ filters }) {
  const { data, isLoading } = useQuery({
    queryKey: ['incomeByProduct', filters],
    queryFn: () => getIncomeByProduct(filters),
    staleTime: 5 * 60 * 1000,
  });

  const option = data
    ? {
        animation: true,
        animationDuration: 500,
        grid: { top: 12, right: 8, bottom: 36, left: 40, containLabel: true },
        xAxis: {
          type: 'category',
          data: data.categories,
          axisLine: { lineStyle: { color: '#E0E7EF' } },
          axisTick: { show: false },
          axisLabel: { fontSize: 10, color: '#64748B' },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
          axisLabel: { fontSize: 10, color: '#94A3B8', formatter: (v) => `${v}B` },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderColor: '#E0E7EF',
          borderWidth: 1,
          textStyle: { color: '#0D1B2A', fontSize: 11 },
          formatter: (params) =>
            `<b style="font-size:11px">${params[0].name}</b><br/>` +
            params
              .map((p) => `${p.marker} <span style="font-size:10px">${p.seriesName}: <b>${p.value}B</b></span>`)
              .join('<br/>'),
        },
        series: data.series.map((s) => ({
          name: s.name,
          type: 'bar',
          barWidth: 13,
          barGap: '8%',
          data: s.data,
          itemStyle: { color: s.color, borderRadius: [3, 3, 0, 0] },
        })),
      }
    : null;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '14px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Dynamic title and legend — driven by data */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.2}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>
            Income By Product
          </Typography>
          {data && (
            <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
              {data.series.map((s) => (
                <Box key={s.name} display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ width: 9, height: 9, borderRadius: '2px', bgcolor: s.color }} />
                  <Typography sx={{ fontSize: '0.67rem', color: 'text.secondary', fontWeight: 600 }}>
                    {s.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {isLoading ? (
          <Skeleton animation="wave" variant="rectangular" sx={{ flex: 1, borderRadius: 1 }} />
        ) : (
          <Box sx={{ flex: 1, minHeight: 220 }}>
            <ReactECharts option={option} style={{ height: '100%', minHeight: 220 }} opts={{ renderer: 'svg' }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
