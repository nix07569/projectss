import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F0F4F8',
      paper: '#FFFFFF',
    },
    primary:  { main: '#1565C0', light: '#1976D2', dark: '#0D47A1' },
    success:  { main: '#2E7D32', light: '#388E3C' },
    error:    { main: '#C62828', light: '#D32F2F' },
    text: {
      primary:   '#0D1B2A',
      secondary: '#546E7A',
      disabled:  '#90A4AE',
    },
    divider: '#E0E7EF',
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", sans-serif',
    h6: { fontWeight: 700 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.775rem' },
    caption: { fontSize: '0.7rem', letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #E0E7EF',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(21,101,192,0.10)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontSize: '0.72rem',
          fontWeight: 600,
          padding: '3px 10px',
          textTransform: 'none',
          border: '1px solid #C5D5E8',
          color: '#546E7A',
          '&.Mui-selected': {
            backgroundColor: '#1565C0',
            color: '#fff',
            '&:hover': { backgroundColor: '#1251A3' },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#EEF2F8',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#37474F',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '7px 12px',
            borderColor: '#E0E7EF',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontSize: '0.78rem',
            color: '#334155',
            padding: '5px 12px',
            borderColor: '#F1F5F9',
          },
          '& .MuiTableRow-root:hover .MuiTableCell-root': {
            backgroundColor: '#F0F6FF',
          },
        },
      },
    },
  },
});

export default Theme;
