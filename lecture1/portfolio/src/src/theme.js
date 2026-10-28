import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7b2ff7',
      light: '#c084fc',
      dark: '#5a1fb5',
    },
    secondary: {
      main: '#00c8ff',
      light: '#67e8ff',
      dark: '#0097cc',
    },
    error: { main: '#ff3cac' },
    warning: { main: '#ffd93d' },
    info: { main: '#4d96ff' },
    success: { main: '#00ff87' },
    background: {
      default: '#04040f',
      paper: 'rgba(28, 16, 56, 0.80)',
    },
    text: {
      primary: 'rgba(255,255,255,0.95)',
      secondary: 'rgba(220, 215, 255, 0.75)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 500 },
    h2: { fontSize: '1.5rem', fontWeight: 500 },
    h3: { fontSize: '1.25rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    caption: { fontSize: '0.75rem', fontWeight: 400 },
  },
  spacing: 8,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(4, 4, 15, 0.75)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(160, 120, 255, 0.18)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(160deg, rgba(28,16,56,0.75) 0%, rgba(10,10,32,0.70) 60%, rgba(8,22,52,0.75) 100%)',
          border: '1px solid rgba(160, 120, 255, 0.18)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(80, 30, 180, 0.22), 0 4px 16px rgba(0,0,0,0.45)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(80, 30, 180, 0.32), 0 8px 24px rgba(0,0,0,0.5)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.14)',
          color: 'rgba(210, 200, 240, 0.9)',
          '&:hover': {
            background: 'rgba(255,255,255,0.11)',
          },
        },
        colorPrimary: {
          background: 'rgba(123, 47, 247, 0.2)',
          border: '1px solid rgba(123, 47, 247, 0.4)',
          color: '#c084fc',
        },
        colorSecondary: {
          background: 'rgba(0, 200, 255, 0.15)',
          border: '1px solid rgba(0, 200, 255, 0.35)',
          color: '#67e8ff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #c084fc, #00c8ff)',
          boxShadow: '0 4px 20px rgba(123, 47, 247, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d09dff, #22d4ff)',
            boxShadow: '0 6px 28px rgba(123, 47, 247, 0.55)',
          },
          /**
           * background 그라데이션이 MUI 의 기본 disabled 스타일(background-color)을
           * 덮어써서, 비활성화돼도 배경은 그대로 밝은데 글자만 흐려져 읽기 어렵다.
           * 배경을 함께 낮춰 대비를 확보한다.
           */
          '&.Mui-disabled': {
            background: 'linear-gradient(135deg, rgba(192,132,252,0.22), rgba(0,200,255,0.22))',
            border: '1px solid rgba(160, 120, 255, 0.25)',
            color: 'rgba(255,255,255,0.7)',
            boxShadow: 'none',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(123, 47, 247, 0.5)',
          color: '#c084fc',
          '&:hover': {
            borderColor: '#7b2ff7',
            background: 'rgba(123, 47, 247, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(160, 120, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(160, 120, 255, 0.6)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7b2ff7',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(160, 120, 255, 0.2)',
        },
      },
    },
  },
});

export default theme;
