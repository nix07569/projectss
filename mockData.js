// mockData.js
// Central mock data store. Replace with real API calls in services/api.js.
// Structure mirrors what your backend would return for each page combination.

export const WIDGET_NAMES = [
  'Income',
  'Impairments',
  'Underlying Profit',
  'Funded Assets',
  'RoTE',
  'Costs',
  'NII',
  'First RWA',
  'JAWS',
  'CIR',
  'Controllable Headcount',
  'Second RWA',
];

// Raw values in absolute units (not scaled).
// api.js scales them based on the unit filter ($m divides by 1e6, $bn by 1e9).
export const WIDGET_RAW = {
  Income: {
    value: 0, yoy: 45.23, direction: 'up',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 0, yoy: null },
      { label: 'PQ Actuals (YoY)', value: 0, yoy: 12.45 },
      { label: 'FY Outlook (YoY)', value: 0, yoy: 67.89 },
    ],
  },
  Impairments: {
    value: 109983410000, yoy: 23.11, direction: 'down',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 100915280000,  yoy: null },
      { label: 'PQ Actuals (YoY)', value: 80219710000,   yoy: 34.55 },
      { label: 'FY Outlook (YoY)', value: 10002710000,   yoy: 78.12 },
    ],
  },
  'Underlying Profit': {
    value: 2947300000, yoy: 12.67, direction: 'up',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 2947300000,    yoy: null },
      { label: 'PQ Actuals (YoY)', value: -25628550000,  yoy: 45.88 },
      { label: 'FY Outlook (YoY)', value: 0,             yoy: 23.45 },
    ],
  },
  'Funded Assets': {
    value: 2235372870000, yoy: 56.22, direction: 'down',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 2235372870000,  yoy: null },
      { label: 'PQ Actuals (YoY)', value: 38400915610000, yoy: 11.9 },
      { label: 'FY Outlook (YoY)', value: 0,              yoy: 39.44 },
    ],
  },
  RoTE: {
    value: 0, yoy: 8.55, direction: 'up',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 0, yoy: null },
      { label: 'PQ Actuals (YoY)', value: 0, yoy: 19.77 },
      { label: 'FY Outlook (YoY)', value: 0, yoy: 72.11 },
    ],
  },
  Costs: {
    value: 2433000000, yoy: 34.9, direction: 'down',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 2433000000,  yoy: null },
      { label: 'PQ Actuals (YoY)', value: 74376270000, yoy: 22.1 },
      { label: 'FY Outlook (YoY)', value: 0,           yoy: 11.45 },
    ],
  },
  NII: {
    value: 831540000, yoy: 66.66, direction: 'up',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 831540000,   yoy: null },
      { label: 'PQ Actuals (YoY)', value: 16267760000, yoy: 33.33 },
      { label: 'FY Outlook (YoY)', value: 0,           yoy: 10.1 },
    ],
  },
  'First RWA': {
    value: 2028281490000, yoy: 14.14, direction: 'down',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 2028281490000,  yoy: null },
      { label: 'PQ Actuals (YoY)', value: 35197830350000, yoy: 55.55 },
      { label: 'FY Outlook (YoY)', value: 0,              yoy: 44.44 },
    ],
  },
  JAWS: {
    value: 488670000, yoy: 27.27, direction: 'up',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 488670000, yoy: null },
      { label: 'PQ Actuals (YoY)', value: 130190000, yoy: 61.61 },
      { label: 'FY Outlook (YoY)', value: 570910000, yoy: 18.18 },
    ],
  },
  CIR: {
    value: 1232163340000, yoy: 9.99, direction: 'down',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 1232163340000,  yoy: null },
      { label: 'PQ Actuals (YoY)', value: 361838800000,   yoy: 49.49 },
      { label: 'FY Outlook (YoY)', value: 1315677780000,  yoy: 70.7 },
    ],
  },
  'Controllable Headcount': {
    value: 370000, yoy: 31.31, direction: 'up',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 280000, yoy: null },
      { label: 'PQ Actuals (YoY)', value: 0,      yoy: 49.49 },
      { label: 'FY Outlook (YoY)', value: 0,      yoy: 41.41 },
    ],
  },
  'Second RWA': {
    value: 1267916900000, yoy: 77.77, direction: 'down',
    label: 'YTD Actuals (YoY)',
    subRows: [
      { label: 'vs Budget',        value: 957641650000,   yoy: null },
      { label: 'PQ Actuals (YoY)', value: 1255288650000,  yoy: 13.13 },
      { label: 'FY Outlook (YoY)', value: 0,              yoy: 59.59 },
    ],
  },
};

export const INCOME_BY_PRODUCT = {
  categories: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
  series: [
    { name: 'FY Outlook', color: '#1565C0', data: [2.2, 4.0, 10.0, 6.5, 3.1] },
    { name: 'YTD',        color: '#42A5F5', data: [1.9, 3.5,  9.2, 5.8, 2.7] },
    { name: 'FY Budget',  color: '#BBDEFB', data: [2.0, 3.8,  9.8, 6.2, 2.9] },
  ],
};

export const INCOME_BY_CLUSTER = [
  {
    id: 'all', level: 0, label: '(all)',
    ytd: 9009164724.23, yoyPct: 1.46,
    q3Outlook: 2713863131.93, fyOutlook: 9175025425.30,
    children: ['am', 'emea', 'apac'],
  },
  {
    id: 'am', level: 1, label: 'AM',
    ytd: 607908082.12, yoyPct: -7.70,
    q3Outlook: 331843530.56, fyOutlook: 8593868043.09,
    parent: 'all', children: ['usa', 'canada'],
  },
  {
    id: 'usa', level: 2, label: 'USA',
    ytd: 300000000, yoyPct: 2.10,
    q3Outlook: 120000000, fyOutlook: 500000000,
    parent: 'am', children: [],
  },
  {
    id: 'canada', level: 2, label: 'Canada',
    ytd: 180000000, yoyPct: -3.50,
    q3Outlook: 90000000, fyOutlook: 310000000,
    parent: 'am', children: [],
  },
  {
    id: 'emea', level: 1, label: 'EMEA',
    ytd: 4200000000, yoyPct: 3.20,
    q3Outlook: 1100000000, fyOutlook: 4500000000,
    parent: 'all', children: [],
  },
  {
    id: 'apac', level: 1, label: 'APAC',
    ytd: 2100000000, yoyPct: -1.10,
    q3Outlook: 850000000, fyOutlook: 2300000000,
    parent: 'all', children: [],
  },
];
