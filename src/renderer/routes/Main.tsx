// Footer for main page
import { Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { isObject } from '../../domain/validate';
import MainDiv from '../components/MainDiv';
import Tournament from '../../domain/tournament';

const Main = () => {
  const dispatch = useDispatch();

  return (
    <MainDiv>
      <Typography variant="h2">NVC Tournament Manager</Typography>
      <Typography variant="h3">ERIK</Typography>
      <MainDiv>
        <Button
          variant="outlined"
          onClick={() => {
            window.electron
              .importFile()
              .then((value: unknown) => {
                const tourny = value as Tournament | null;
                if (tourny) {
                  dispatch({ type: 'loadTournament', payload: tourny });
                }
                return 0;
              })
              .catch((errors: unknown) => {
                // eslint-disable-next-line no-console
                console.log(errors);
              });
          }}
        >
          New Tournament
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            window.electron
              .loadTournament()
              .then((tourny) => {
                if (isObject(tourny)) {
                  dispatch({ type: 'loadTournament', payload: tourny });
                }
                return 0;
              })
              .catch((errors) => {
                // eslint-disable-next-line no-console
                console.log(errors);
              });
          }}
        >
          Load Tournament
        </Button>
      </MainDiv>
    </MainDiv>
  );
};

export default Main;
