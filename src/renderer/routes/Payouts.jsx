import * as React from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { hasProp } from 'domain/validate';
import calcPayouts from '../../domain/payouts';
import MainDiv from '../components/MainDiv';

// React fragment with card content
const payoutCard = (place, prize) => {
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
  const payouts = useSelector((state) => {
    // Tournament payouts
    const tPayouts = {};
    // Attempt to pull out payouts for Men's, Women's, and Coed leagues
    if (
      hasProp(state, 'financials') &&
      hasProp(state.financials, 'payoutDivisions')
    ) {
      Object.keys(state.financials.payoutDivisions).forEach((day) => {
        if (hasProp(state, day)) {
          state.financials.payoutDivisions[day].forEach((payout) => {
            const totalTeams =
              state[day].divisions[payout.main].teams.length +
              state[day].divisions[payout.sub].teams.length;

            // Calculate payouts for this division
            const divPayout = calcPayouts(
              totalTeams,
              state.financials.payoutParams.prizePool,
              state.financials.payoutParams[day]
            );
            Object.keys(divPayout).forEach((div) => {
              tPayouts[payout[div]] = {};
              Object.keys(divPayout[div]).forEach((place) => {
                tPayouts[payout[div]][place] = divPayout[div][place];
              });
            });
          });
        }
      });
    }

    return tPayouts;
  });

  return (
    <Box>
      {Object.keys(payouts).map((division) => (
        <MainDiv>
          <Typography variant="h2">{division}</Typography>
          <>
            {Object.keys(payouts[division]).map((place, ind) => (
              <Card
                variant="outlined"
                sx={{
                  width: `${
                    100 / (Object.keys(payouts[division]).length + 1)
                  }%`,
                  display: 'inline-block',
                  padding: '0px',
                }}
              >
                {payoutCard(place, payouts[division][place])}
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
