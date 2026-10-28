import { createTheme } from '@mui/material/styles';

/** 맛스타그램 디자인 시스템 — 오렌지 메인 / 연한 오렌지 보조 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
      light: '#FF9A6C',
      dark: '#E24E1B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFD8A8',
      light: '#FFF4E6',
      dark: '#FFB566',
      contrastText: '#5A3A22',
    },
    background: {
      default: '#FFFBF7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2B2118',
      secondary: '#8A7A6D',
    },
    divider: '#F0E4DA',
  },
  typography: {
    fontFamily:
      '"Pretendard", "Apple SD Gothic Neo", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { overflowY: 'scroll' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export default theme;
