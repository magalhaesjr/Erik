// Footer for main page
import { styled } from '@mui/material';

// Styled div
const MainDiv = styled('div')(({ theme }) => ({
  backgound: theme.palette.primary.main,
  color: theme.palette.secondary.light,
  flex: 1,
  textAlign: 'center',
  alignContent: 'center',
}));

export default MainDiv;
