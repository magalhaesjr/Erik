// Creates main layout of app
import { ReactNode } from 'react';
import { Box } from '@mui/material';
// components of webpage
import OutDrawer from './Drawer';
// import Header from "./Header";
// import Footer from "./Footer";
import MainDiv from '../components/MainDiv';

// Defines Property as a non-null ReactNode
type Props = {
  children: NonNullable<ReactNode>;
};

// Layout component
// The layout can take any react component and
// place it in the main tag within this component
// eslint-disable-next-line react/prop-types
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <MainDiv
      sx={{
        flexDirection: 'column',
        display: 'block',
        minHeight: '100vh',
      }}
    >
      <Box>
        <OutDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            flex: 1,
            marginLeft: '180px',
            width: 'auto',
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </MainDiv>
  );
};

export default Layout;
