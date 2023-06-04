import { useMemo } from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useAppSelector } from '../redux/hooks';
import calcPayouts, { PrizePayout } from '../../domain/payouts';
import MainDiv from '../components/MainDiv';
import { RootState } from '../redux/store';
import { getDivisionKey } from '../../domain/utility';
import Division from '../../domain/division';
import { selectDayPayout } from '../redux/financials';
import {
  selectSaturdayDivisions,
  selectSundayDivisions,
} from '../redux/tournament';

// Helper functions
const getNumTeams = (div?: Division) => {
  if (div) {
    return div.props.teams.length;
  }
  return 0;
};

const selectSaturdayPay = (state: RootState) => {
  return selectDayPayout(state, 'saturday');
};
const selectSundayPay = (state: RootState) => {
  return selectDayPayout(state, 'sunday');
};

// React fragment with card content
const payoutCard = (place: string, prize: number) => {
  return (
    <>
      <CardContent>
        <Typography variant="h3">{place}</Typography>
        <Typography variant="h4">{`$${prize}`}</Typography>
      </CardContent>
    </>
  );
};

// Registration Page
const Payouts = () => {
  /** State */
  // Saturday
  const saturdayPayout = useAppSelector(selectSaturdayPay, isEqual);
  const saturdayDiv = useAppSelector(selectSaturdayDivisions, isEqual);

  // Sunday
  const sundayPayout = useAppSelector(selectSundayPay, isEqual);
  const sundayDiv = useAppSelector(selectSundayDivisions, isEqual);

  /** Effects */
  const payouts = useMemo(() => {
    const tPayouts: PrizePayout = {};
    saturdayPayout.divisions.forEach((div) => {
      const { main, sub } = div;
      let totalTeams = 0;
      totalTeams += getNumTeams(saturdayDiv[getDivisionKey(main)]);
      if (sub) {
        totalTeams += getNumTeams(saturdayDiv[getDivisionKey(sub)]);
      }
      // Calculate payouts for this division
      const divPayout = calcPayouts(
        totalTeams,
        saturdayPayout.prizePool,
        saturdayPayout.params
      );
      tPayouts[main] = divPayout.main;
      if (Object.keys(divPayout.sub).length > 0 && sub) {
        tPayouts[sub] = divPayout.sub;
      }
    });

    sundayPayout.divisions.forEach((div) => {
      const { main, sub } = div;
      let totalTeams = 0;
      totalTeams += getNumTeams(sundayDiv[getDivisionKey(main)]);
      if (sub) {
        totalTeams += getNumTeams(sundayDiv[getDivisionKey(sub)]);
      }
      // Calculate payouts for this division
      const divPayout = calcPayouts(
        totalTeams,
        sundayPayout.prizePool,
        sundayPayout.params
      );
      tPayouts[main] = divPayout.main;
      if (Object.keys(divPayout.sub).length > 0 && sub) {
        tPayouts[sub] = divPayout.sub;
      }
    });

    return tPayouts;
  }, [saturdayPayout, saturdayDiv, sundayPayout, sundayDiv]);

  return (
    <Box>
      {Object.entries(payouts).map(([division, prizeBreakdown]) => (
        <MainDiv key={division}>
          <Typography variant="h2">{division}</Typography>
          <>
            {Object.entries(prizeBreakdown).map(([place, prize]) => (
              <Card
                variant="outlined"
                key={place}
                sx={{
                  width: `${100 / (Object.keys(prizeBreakdown).length + 1)}%`,
                  display: 'inline-block',
                  padding: '0px',
                }}
              >
                {payoutCard(place, prize)}
              </Card>
            ))}
          </>
          <Divider />
        </MainDiv>
      ))}
    </Box>
  );
};

export default Payouts;
