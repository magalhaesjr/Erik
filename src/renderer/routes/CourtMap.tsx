// Footer for main page
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import MainDiv from '../components/MainDiv';
import CourtCard from '../components/CourtCard';
import { hasProp } from '../../domain/validate';
import { RootState } from '../redux/store';

// Footer component
const CourtMap = () => {
  // Grabs selector from redux
  const courts = useSelector((state: RootState) => {
    if (hasProp(state, 'courts')) {
      return state.courts;
    }
    return [];
  });

  if (courts.length > 0) {
    return (
      <MainDiv>
        <Typography variant="h2">Court Map</Typography>
        <Grid
          container
          columnSpacing={4}
          direction="row-reverse"
          rowSpacing={2}
        >
          <Grid key="wall" item xs={6}>
            <Typography variant="h4">Wall</Typography>
          </Grid>
          <Grid key="ocean" item xs={6}>
            <Typography variant="h4">Ocean</Typography>
          </Grid>
          {courts.map(
            (court) =>
              court.number && (
                <Grid key={court.number} item xs={6}>
                  <CourtCard courtNumber={court.number} />
                </Grid>
              )
          )}
        </Grid>
      </MainDiv>
    );
  }

  return <MainDiv />;
};

export default CourtMap;
