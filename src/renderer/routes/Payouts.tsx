import { useMemo } from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useAppSelector } from '../redux/hooks';
import calcPayouts, { PrizePayout } from '../../domain/payouts';
import MainDiv from '../components/MainDiv';
import { getDivisionKey } from '../../domain/utility';
import { selectDayPayout } from '../redux/financials';
import { DivisionEntries, selectEntries } from '../redux/entries';
import { RootState } from '../redux/store';

/** Static Callbacks */
const getNumTeams = (entries: DivisionEntries) => {
  if (!entries) {
    return 0;
  }
  return Object.values(entries).filter((e) => !e.isWaitlisted).length;
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
  // Tournament entries
  const entries = useAppSelector(selectEntries, isEqual);

  // Saturday
  const saturdayPayout = useAppSelector(selectSaturdayPay, isEqual);
  // Sunday
  const sundayPayout = useAppSelector(selectSundayPay, isEqual);

  /** Effects */
  const payouts = useMemo(() => {
    const tPayouts: PrizePayout = {};
    saturdayPayout.divisions.forEach((div) => {
      const { main, sub } = div;
      let totalTeams = 0;
      totalTeams += getNumTeams(entries[getDivisionKey(main)]);
      if (sub) {
        totalTeams += getNumTeams(entries[getDivisionKey(sub)]);
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
      totalTeams += getNumTeams(entries[getDivisionKey(main)]);
      if (sub) {
        totalTeams += getNumTeams(entries[getDivisionKey(sub)]);
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
  }, [saturdayPayout, sundayPayout, entries]);

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
