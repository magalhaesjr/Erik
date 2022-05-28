// Footer for main page
import { AppBar, Typography } from '@mui/material';
// Header component
const Header = () => {
  return (
    <AppBar
      sx={{
        position: 'fixed',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Typography variant="h6">Header</Typography>
    </AppBar>
  );
};

export default Header;
