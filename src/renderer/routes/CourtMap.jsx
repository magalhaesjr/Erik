// Footer for main page
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import MainDiv from '../components/MainDiv';
import CourtCard from '../components/CourtCard';
import { hasProp } from '../../domain/validate';

// Footer component
const CourtMap = () => {
  // Grabs selector from redux
  const courts = useSelector((state) => {
    if (hasProp(state, 'courts')) {
      return state.courts;
    }
    return [];
  });

  if (courts.length > 0) {
    return (
      <MainDiv>
        <Typography variant="h2">Court Map</Typography>
        <Grid container columnSpacing={4} rowSpacing={2}>
          {courts.map((court) => (
            <Grid key={court.number} item xs={6}>
              <CourtCard courtNumber={court.number + 1} />
            </Grid>
          ))}
        </Grid>
      </MainDiv>
    );
  }

  return <MainDiv />;
};

export default CourtMap;
