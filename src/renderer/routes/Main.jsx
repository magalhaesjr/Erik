// Footer for main page
import { Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import MainDiv from '../components/MainDiv';

const Main = () => {
  const dispatch = useDispatch();

  return (
    <MainDiv>
      <Typography variant="h2">NVC Tournament Manager</Typography>
      <Typography variant="h3">ERIK</Typography>
      <MainDiv>
        <Button
          variant="primary"
          onClick={() => {
            window.electron
              .importFile()
              .then((tourny) => {
                if (tourny !== undefined && tourny !== null) {
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
