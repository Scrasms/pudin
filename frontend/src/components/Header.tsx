import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import type { ReactNode } from 'react';
import headerDrip from '../assets/header_drip.svg';

// Header with content spread on left and right and option to display a drip style
const Header = ({
  showStyle,
  children,
}: {
  showStyle?: boolean;
  children?: ReactNode;
}) => {
  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            bgcolor: 'secondary.main',
            p: '15px',
          }}
        >
          {!showStyle && children}
        </Toolbar>
        {showStyle && (
          <Box component="img" src={headerDrip} sx={{ width: '100%' }} />
        )}
      </AppBar>
    </>
  );
};

export default Header;
