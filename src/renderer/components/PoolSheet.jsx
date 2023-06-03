// Creates a React table for all entries into division
import * as React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, styled, Grid } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectTournament, updatePool } from '../redux/tournament';
import { hasProp } from '../../domain/validate';
import PoolHeader from './poolSheet/PoolHeader';
import PoolSchedule from './poolSheet/PoolSchedule';
import PoolMatch from './poolSheet/PoolMatch';

// Styles
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  /** TODO: REPLACE ME */
  const tournament = useAppSelector(selectTournament);
  const getPool = (state) => {
    let divPool = {};
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day], 'divisions')) {
        if (hasProp(state[day].divisions, division)) {
          // Get pool
          if (poolId < state[day].divisions[division].props.pools.length) {
            divPool = state[day].divisions[division].props.pools[poolId];
          }
        }
      }
    });

    return divPool;
  };
  const pool = getPool(tournament);
  /** END TODO */

  // Dispatcher
  const dispatch = useAppDispatch();

  // Handler
  const handleChange = (val) => {
    dispatch(
      updatePool({
        division: pool.props.division,
        id: poolId,
        playoffTeams: val,
      })
    );
  };

  if (pool !== undefined && Object.keys(pool).length > 0) {
    return (
      <PoolPaper
        ref={ref}
        sx={{
          maxHeight: pool.teams.length > 5 ? '21.8in' : '10.8in',
          overflowY: 'hidden',
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <PoolHeader pool={pool} onChange={handleChange} />
          </Grid>
          <Grid item xs={2}>
            <PoolSchedule pool={pool} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center">
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
