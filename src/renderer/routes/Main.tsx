// Footer for main page
import { useCallback } from 'react';
import { Typography, Button } from '@mui/material';
import { useAppDispatch } from '../redux/hooks';
import { importSheet, importTournament } from '../redux/tournament';
import MainDiv from '../components/MainDiv';

const Main = () => {
  const dispatch = useAppDispatch();

  /** Callbacks */
  const handleImportTournament = useCallback(() => {
    dispatch(importTournament());
  }, [dispatch]);

  const handleImportSheet = useCallback(() => {
    dispatch(importSheet());
  }, [dispatch]);

  return (
    <MainDiv>
      <Typography variant="h2">NVC Tournament Manager</Typography>
      <Typography variant="h3">ERIK</Typography>
      <MainDiv>
        <Button variant="outlined" onClick={handleImportSheet}>
          New Tournament
        </Button>
        <Button variant="outlined" onClick={handleImportTournament}>
          Load Tournament
        </Button>
      </MainDiv>
    </MainDiv>
  );
};

export default Main;
