import { AppBar, Box, Toolbar } from '@mui/material';
import headerDrip from '../assets/header_drip.svg';

function Header() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ backgroundColor: 'secondary.main' }}>
          </Toolbar>
        </AppBar>
        <Box component="img" src={headerDrip}></Box>
      </Box>
    </>
  );
}

export default Header;
