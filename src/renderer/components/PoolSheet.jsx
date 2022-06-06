// Creates a React table for all entries into division
import * as React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, styled, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import PoolHeader from './poolSheet/PoolHeader';
import PoolSchedule from './poolSheet/PoolSchedule';
import PoolMatch from './poolSheet/PoolMatch';

// Styles
const PoolPaper = styled(Paper)(({ theme }) => ({
  fontFamily: 'Calibri',
  fontSize: '8',
  boxShadow: 'none',
  margin: '0in',
  padding: '0px',
  width: '8.2in',
  background: '#ffffff',
}));

// Division entries table
const PoolSheet = React.forwardRef((props, ref) => {
  const { division, poolId } = props;

  // Grabs selector from redux
  const pool = useSelector((state) => {
    // eslint-disable-next-line prettier/prettier
    let divPool = {};
    Object.keys(state).forEach((day) => {
      // eslint-disable-next-line prettier/prettier
      if (Object.prototype.hasOwnProperty.call(state[day].divisions, division)) {
        // Get pool
        if (poolId < state[day].divisions[division].pools.length) {
          divPool = state[day].divisions[division].pools[poolId];
        }
      }
    });
    return divPool;
  });

  if (pool !== undefined && Object.keys(pool).length > 0) {
    return (
      <PoolPaper ref={ref}>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <PoolHeader pool={pool} />
          </Grid>
          <Grid item xs={2}>
            <PoolSchedule pool={pool} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" textAlign="center">
              Warm-Ups are Limited to 10 Minutes!
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <PoolMatch pool={pool} />
          </Grid>
        </Grid>
      </PoolPaper>
    );
  }
  return null;
});

PoolSheet.propTypes = {
  division: PropTypes.string.isRequired,
  poolId: PropTypes.number.isRequired,
};

export default PoolSheet;
