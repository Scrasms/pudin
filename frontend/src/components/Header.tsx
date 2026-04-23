import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import headerDrip from '../assets/header_drip.svg';

function Header() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ backgroundColor: 'secondary.main' }}></Toolbar>
        </AppBar>
        <Box component="img" src={headerDrip}></Box>
      </Box>
    </>
  );
}

export default Header;
