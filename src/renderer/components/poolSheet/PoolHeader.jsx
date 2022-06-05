// Returns the pool sheet header table
import PropTypes from 'prop-types';
import { Paper } from '@mui/material';
import PoolInfo from './PoolInfo';
import PoolFormat from './PoolFormat';
import PoolResults from './PoolResults';

const PoolHeader = (props) => {
  const { pool } = props;

  return (
    <Paper
      sx={{
        width: '6.4in',
        boxShadow: 'none',
      }}
    >
      <PoolInfo inputCourt={0} division={pool.division} />
      <PoolFormat
        numGames={pool.numGames}
        points={pool.points}
        playoffTeams={pool.playoffTeams}
      />
      <PoolResults teams={pool.teams} />
    </Paper>
  );
};

PoolHeader.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  pool: PropTypes.object.isRequired,
};

export default PoolHeader;
