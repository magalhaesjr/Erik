// Returns the pool sheet header table
import * as React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import MainDiv from '../MainDiv';

const PoolFormat = (props) => {
  const { numGames, points, playoffTeams } = props;
  return (
    <MainDiv>
      {numGames === 1 ? (
        <Typography
          variant="h5"
          width="50%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          {`${numGames} Game to ${points} Points`}
        </Typography>
      ) : (
        <Typography
          variant="h5"
          width="50%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          {`${numGames} Games to ${points} Points`}
        </Typography>
      )}
      <Typography
        variant="h5"
        width="50%"
        sx={{
          color: 'black',
          display: 'inline-block',
        }}
      >
        {`Top ${playoffTeams} Break`}
      </Typography>
    </MainDiv>
  );
};

PoolFormat.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  numGames: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  playoffTeams: PropTypes.number.isRequired,
};

export default PoolFormat;
