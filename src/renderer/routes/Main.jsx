// Footer for main page
import { Typography, Button } from '@mui/material';
import MainDiv from '../components/MainDiv';

// Footer component
const Main = () => {
  return (
    <MainDiv>
      <Typography variant="h2">NVC Tournament Manager</Typography>
      <Typography variant="h3">ERIK</Typography>
      <MainDiv>
        <Button variant="primary" onClick={window.electron.importFile}>
          New Tournament
        </Button>
        <Button variant="primary" onClick={window.electron.showContents}>
          Load Tournament
        </Button>
      </MainDiv>
    </MainDiv>
  );
};

export default Main;
