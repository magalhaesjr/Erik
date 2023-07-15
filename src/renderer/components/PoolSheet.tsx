// Creates a React table for all entries into division
import { forwardRef, useCallback } from 'react';
import { Paper, Typography, styled, Grid } from '@mui/material';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import type { RootState } from '../redux/store';
import PoolHeader from './poolSheet/PoolHeader';
import PoolSchedule from './poolSheet/PoolSchedule';
import PoolMatch from './poolSheet/PoolMatch';
import { selectPool, updatePools } from '../redux/pools';

/** Types */
export type PoolSheetProps = {
  division: string;
  poolId: number;
};

/** Styles */
const PoolPaper = styled(Paper)(() => ({
  fontFamily: 'Calibri',
  fontSize: '8',
  boxShadow: 'none',
  margin: '0in',
  padding: '0px',
  width: '8.2in',
  background: '#ffffff',
}));

// Division entries table
const PoolSheet = forwardRef<HTMLDivElement | null, PoolSheetProps>(
  (props, ref) => {
    const { division, poolId } = props;

    /** State */
    const selectThisPool = useCallback(
      (state: RootState) => {
        return selectPool(state, division, poolId);
      },
      [division, poolId]
    );

    const pool = useAppSelector(selectThisPool, isEqual);

    // Dispatcher
    const dispatch = useAppDispatch();

    // Handler
    const handleChange = useCallback(
      (playoffTeams: number) => {
        if (pool) {
          const newPool = cloneDeep(pool);
          newPool.format.playoffTeams = playoffTeams;
          dispatch(updatePools('updateFormat', { pool: newPool }));
        }
      },
      [pool, dispatch]
    );

    const handleCourtChange = useCallback(
      (court: number) => {
        if (pool) {
          const newPool = cloneDeep(pool);
          newPool.courts = [court];
          dispatch(updatePools('updateCourt', { pool: newPool }));
        }
      },
      [pool, dispatch]
    );

    if (pool !== null && Object.keys(pool).length > 0) {
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
              <PoolHeader
                pool={pool}
                onChange={handleChange}
                onCourtChange={handleCourtChange}
              />
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
  }
);

export default PoolSheet;
