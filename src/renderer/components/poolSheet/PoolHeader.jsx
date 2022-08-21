// Returns the pool sheet header table
import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@mui/material';
import PoolInfo from './PoolInfo';
import PoolFormat from './PoolFormat';
import PoolResults from './PoolResults';

const PoolHeader = (props) => {
  const { pool, onChange } = props;

  const handleChange = (val) => {
    onChange(val);
  };

  return (
    <Paper
      sx={{
        width: '6.4in',
        boxShadow: 'none',
      }}
    >
      <PoolInfo inputCourt={pool.courts} division={pool.division} />
      <PoolFormat
        numGames={pool.numGames}
        points={pool.points}
        playoffTeams={pool.playoffTeams}
        onChange={handleChange}
      />
      <PoolResults teams={pool.teams} />
    </Paper>
  );
};

PoolHeader.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  pool: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

PoolHeader.defaultProps = {
  onChange: () => {},
};

export default PoolHeader;
