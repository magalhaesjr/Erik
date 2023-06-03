import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import calcPayouts, { PrizePayout } from '../../domain/payouts';
import MainDiv from '../components/MainDiv';
import { RootState } from '../redux/store';
import { getDivisionKey } from '../../domain/utility';
import Division from '../../domain/division';

// Helper functions
const getNumTeams = (div?: Division) => {
  if (div) {
    return div.props.teams.length;
  }
  return 0;
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
  // Grabs selector from redux
  const payouts = useSelector((state: RootState) => {
    // Tournament payouts
    const tPayouts: PrizePayout = {};
    const { payoutDivisions } = state.financials;
    if (payoutDivisions.saturday) {
      payoutDivisions.saturday.forEach((div) => {
        const { main, sub } = div;
        let totalTeams = 0;
        totalTeams += getNumTeams(
          state.saturday.divisions[getDivisionKey(main)]
        );
        if (sub) {
          totalTeams += getNumTeams(
            state.saturday.divisions[getDivisionKey(sub)]
          );
        }
        if (state.financials.payoutParams.saturday) {
          // Calculate payouts for this division
          const divPayout = calcPayouts(
            totalTeams,
            state.financials.payoutParams.prizePool,
            state.financials.payoutParams.saturday
          );
          tPayouts[main] = divPayout.main;
          if (Object.keys(divPayout.sub).length > 0 && sub) {
            tPayouts[sub] = divPayout.sub;
          }
        }
      });
    }
    if (payoutDivisions.sunday) {
      payoutDivisions.sunday.forEach((div) => {
        const { main, sub } = div;
        let totalTeams = 0;
        totalTeams += getNumTeams(state.sunday.divisions[getDivisionKey(main)]);
        if (sub) {
          totalTeams += getNumTeams(
            state.sunday.divisions[getDivisionKey(sub)]
          );
        }
        if (state.financials.payoutParams.sunday) {
          // Calculate payouts for this division
          const divPayout = calcPayouts(
            totalTeams,
            state.financials.payoutParams.prizePool,
            state.financials.payoutParams.sunday
          );
          tPayouts[main] = divPayout.main;
          if (Object.keys(divPayout.sub).length > 0 && sub) {
            tPayouts[sub] = divPayout.sub;
          }
        }
      });
    }
    return tPayouts;
  });

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
