// services/api.js
// Each function mirrors a real API call. The mock data is used when
// REACT_APP_API_BASE_URL is not set. Replace mock bodies with real axios calls.

import axios from 'axios';
import {
  WIDGET_NAMES,
  WIDGET_RAW,
  INCOME_BY_PRODUCT,
  INCOME_BY_CLUSTER,
} from '../mockData';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Simulated network delay for mock data
const delay = (ms = 300 + Math.random() * 500) =>
  new Promise((res) => setTimeout(res, ms));

// Scale raw absolute values to the selected unit
function scaleValue(raw, unit) {
  if (raw === null || raw === undefined) return null;
  const scale = unit === '$bn' ? 1_000_000_000 : 1_000_000;
  return raw / scale;
}

// ── GET WIDGET NAMES ──────────────────────────────────────────────────────
export async function getWidgetNames(filters) {
  await delay();
  // Real: const res = await client.get('/widgets/names', { params: filters });
  //       return res.data.names;
  return WIDGET_NAMES;
}

// ── GET SINGLE WIDGET DATA ────────────────────────────────────────────────
export async function getWidgetDataSingle(name, filters = {}) {
  await delay();
  // Real: const res = await client.get(`/widgets/${encodeURIComponent(name)}`, { params: filters });
  //       return res.data;

  const raw = WIDGET_RAW[name];
  if (!raw) throw new Error(`Unknown widget: ${name}`);
  const { unit = '$m' } = filters;

  return {
    name,
    value:     scaleValue(raw.value, unit),
    yoy:       raw.yoy,
    direction: raw.direction,
    label:     raw.label,
    subRows:   raw.subRows.map((r) => ({
      label: r.label,
      value: scaleValue(r.value, unit),
      yoy:   r.yoy,
    })),
  };
}

// ── GET INCOME BY PRODUCT ─────────────────────────────────────────────────
export async function getIncomeByProduct(filters) {
  await delay();
  // Real: const res = await client.get('/charts/income-by-product', { params: filters });
  //       return res.data;
  return INCOME_BY_PRODUCT;
}

// ── GET INCOME BY CLUSTER ─────────────────────────────────────────────────
export async function getIncomeByCluster(filters) {
  await delay();
  // Real: const res = await client.get('/tables/income-by-cluster', { params: filters });
  //       return res.data;
  return INCOME_BY_CLUSTER;
}
