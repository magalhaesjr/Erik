// Footer for main page
import { useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useAppSelector } from '../redux/hooks';
import MainDiv from '../components/MainDiv';
import CourtCard, {
  DivisionCourts,
  DivisionRequired,
} from '../components/CourtCard';
import { selectCourts, selectDivisionCourts } from '../redux/courts';
import { selectDivisions } from '../redux/entries';
import { selectRequiredCourts } from '../redux/rules';
import { RootState } from '../redux/store';

// Footer component
const CourtMap = () => {
  // Grabs selector from redux
  const divisions = useAppSelector(selectDivisions, isEqual);
  const courts = useAppSelector(selectCourts, isEqual);
  const selectDivCourts = useCallback(
    (state: RootState): DivisionCourts => {
      return Object.fromEntries(
        divisions.map((div) => {
          const divCourts = selectDivisionCourts(state, div);
          return [div, divCourts.length];
        })
      );
    },
    [divisions]
  );
  const selectDivNets = useCallback(
    (state: RootState): DivisionRequired => {
      return Object.fromEntries(
        divisions.map((div) => [div, selectRequiredCourts(state, div)])
      );
    },
    [divisions]
  );

  const divisionCourts = useAppSelector(selectDivCourts, isEqual);
  const divisionNets = useAppSelector(selectDivNets, isEqual);

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
                  <CourtCard
                    courtNumber={court.number}
                    divisionNets={divisionNets}
                    divisionCourts={divisionCourts}
                  />
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
