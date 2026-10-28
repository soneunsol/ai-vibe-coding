import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About Me', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Guestbook', path: '/guestbook' },
  { label: 'Contact', path: '/contact' },
];

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNav('/')}>
          <svg width="28" height="28" viewBox="0 0 110 110" fill="none">
            <defs>
              <linearGradient id="navOrb" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00c8ff" />
                <stop offset="50%" stopColor="#7b2ff7" />
                <stop offset="100%" stopColor="#ff3cac" />
              </linearGradient>
            </defs>
            <circle cx="55" cy="55" r="20" fill="url(#navOrb)" fillOpacity="0.9" />
            <circle cx="55" cy="55" r="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            <circle cx="49" cy="49" r="6" fill="rgba(255,255,255,0.25)" />
          </svg>
          <Typography
            variant="h2"
            sx={{
              /** 태블릿 폭에서는 로고도 줄여 메뉴 5개가 들어갈 자리를 만든다 */
              fontSize: { xs: '1.2rem', sm: '1rem', md: '1.2rem' },
              fontWeight: 700,
              whiteSpace: 'nowrap',
              background: 'linear-gradient(90deg, #c084fc, #00c8ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI 바이브코딩웹
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  background: 'rgba(10, 10, 32, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderLeft: '1px solid rgba(160, 120, 255, 0.2)',
                  width: 200,
                },
              }}
            >
              <List>
                {NAV_ITEMS.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      selected={location.pathname === item.path}
                      onClick={() => handleNav(item.path)}
                      sx={{
                        '&.Mui-selected': {
                          background: 'rgba(123, 47, 247, 0.2)',
                          borderLeft: '3px solid #7b2ff7',
                        },
                        color: 'rgba(220, 215, 255, 0.9)',
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          NAV_ITEMS.map((item) => (
            <Button
              key={item.path}
              onClick={() => handleNav(item.path)}
              sx={{
                color: location.pathname === item.path
                  ? '#c084fc'
                  : 'rgba(220, 215, 255, 0.75)',
                fontWeight: location.pathname === item.path ? 700 : 400,
                borderBottom: location.pathname === item.path
                  ? '2px solid #7b2ff7'
                  : '2px solid transparent',
                borderRadius: 0,
                /** 메뉴가 5개라, 태블릿 폭에서는 여백을 줄여야 툴바가 넘치지 않는다 */
                px: { sm: 1, md: 2 },
                fontSize: { sm: '0.8125rem', md: '0.875rem' },
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                '&:hover': {
                  color: '#c084fc',
                  background: 'rgba(123, 47, 247, 0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
