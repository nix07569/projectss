# FinSight.Performance — CRA Implementation Guide

## File Structure

```
finsight-performance/
├── public/
│   └── index.html
├── src/
│   ├── index.js              ← CRA entry point
│   ├── App.js                ← QueryClient + ThemeProvider
│   ├── Dashboard.js          ← Main orchestrator + navigation logic
│   ├── Theme.js              ← MUI theme
│   ├── mockData.js           ← All mock data in one place
│   ├── services/
│   │   └── api.js            ← Axios layer (swap mocks for real calls here)
│   └── components/
│       ├── KpiCard.js        ← Dynamic KPI card
│       ├── KpiCardSkeleton.js← Wave shimmer placeholder
│       ├── ChartSection.js   ← ECharts grouped bar
│       ├── TableSection.js   ← Hierarchical cluster table
│       └── EmptyState.js     ← Placeholder for pages without data
└── package.json
```

---

## Step 1 — Bootstrap the CRA project

```bash
npx create-react-app finsight-performance
cd finsight-performance
```

## Step 2 — Install dependencies

```bash
npm install \
  @mui/material@^6 \
  @mui/icons-material@^6 \
  @mui/x-data-grid@^7 \
  @emotion/react \
  @emotion/styled \
  @tanstack/react-query@^5 \
  axios \
  echarts \
  echarts-for-react
```

## Step 3 — Copy files

Replace or create the files listed in the structure above. You can safely delete:
- `src/App.css`
- `src/App.test.js`
- `src/logo.svg`
- `src/reportWebVitals.js`
- `src/setupTests.js`

## Step 4 — Start

```bash
npm start
# → http://localhost:3000
```

---

## Navigation Behaviour (key logic in Dashboard.js)

| Action | Result |
|--------|--------|
| Default load | Group selected, Overview selected, $m, RFX |
| Click CIB (was on Group > Overview) | CIB > **Overview** (view carries over) |
| Click Trends (now on CIB > Overview) | CIB > **Trends** |
| Click WRB (now on CIB > Trends) | WRB > **Trends** (view carries over) |
| Click Group (now on WRB > Trends) | Group > **Trends** (view carries over) |
| Click Overview (now on Group > Trends) | Group > **Overview** |

The `activeGroup` and `activeView` are two independent `useState` values.
Clicking a group tab only changes `activeGroup`. Clicking a view tab only
changes `activeView`. They never reset each other.

---

## Header Title

Updates automatically based on selection:

```
Group | Financials Overview
CIB   | Financials Trends
WRB   | Financials Overview
```

---

## Pages with Data

Controlled via a single Set in Dashboard.js:

```js
const PAGES_WITH_DATA = new Set(['Group|Overview']);
```

To add data for CIB > Overview, add `'CIB|Overview'` to this Set and wire
up the API functions in `services/api.js`.

---

## Connecting Your Real API

Open `src/services/api.js`. Each function body has a comment showing the
exact axios call to restore. Example:

```js
// BEFORE (mock)
export async function getWidgetDataSingle(name, filters) {
  await delay();
  return WIDGET_RAW[name];
}

// AFTER (real)
export async function getWidgetDataSingle(name, filters) {
  const res = await client.get(`/widgets/${encodeURIComponent(name)}`, { params: filters });
  return res.data;
}
```

Set your API base URL in a `.env` file:
```
REACT_APP_API_BASE_URL=https://your-api.example.com
```

---

## Adding New Widgets

All widget configuration lives in `src/mockData.js`. To add a widget:

1. Add the name string to `WIDGET_NAMES`
2. Add its data object to `WIDGET_RAW` with:
   - `value` (raw absolute number)
   - `yoy` (percent)
   - `direction` (`'up'` | `'down'`)
   - `label` (e.g. `'YTD Actuals (YoY)'`)
   - `subRows` array — each with `{ label, value, yoy }`

The KpiCard renders whatever subRows it receives — no hardcoding.

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `echarts-for-react` not found | `npm install echarts echarts-for-react` |
| Module resolution error | Make sure all files use `.js` not `.jsx` |
| Blank screen | Check browser console; likely a missing import |
| Old React version | This requires React 18+ (`"react": "^18.3.1"`) |
