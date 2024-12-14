// src/components/Header.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{backgroundColor: '#24a810'}}>
        <Typography variant="h4" component="div" sx={{padding: '20px 0', textAlign:'center', flexGrow: 1, fontWeight: 'bold'}}>
          Oak City Shred Fest 5
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
