import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import NavBar from './components/layout/NavBar.jsx';
import AuroraBackground from './components/common/AuroraBackground.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import Guestbook from './pages/Guestbook.jsx';

const App = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: '#04040f', position: 'relative' }}>
    <AuroraBackground />
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/guestbook" element={<Guestbook />} />
      </Routes>
    </Box>
  </Box>
);

export default App;
