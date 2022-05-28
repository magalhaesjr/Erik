// Footer for main page
import { Typography } from '@mui/material';
import MainDiv from '../components/MainDiv';

// Footer component
const Footer = () => {
  return (
    <MainDiv
      sx={{
        color: 'primary.main',
        p: 2,
      }}
    >
      <Typography variant="h3">Footer</Typography>
    </MainDiv>
  );
};

export default Footer;
