// Returns the pool sheet header table
import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import MainDiv from '../MainDiv';

const PoolFormat = (props) => {
  const { numGames, points, playoffTeams, onChange } = props;

  const handleChange = (event) => {
    onChange(event.target.value);
  };

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
      <Box width="50%">
        <Typography
          variant="h5"
          width="35%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          Top
        </Typography>
        <Select
          id="playoff-select"
          width="50%"
          value={playoffTeams}
          onChange={handleChange}
          variant="standard"
        >
          <MenuItem value={2}>
            <Typography variant="h4">2</Typography>
          </MenuItem>
          <MenuItem value={3}>
            <Typography variant="h4">3</Typography>
          </MenuItem>
          <MenuItem value={4}>
            <Typography variant="h4">4</Typography>
          </MenuItem>
        </Select>
        <Typography
          variant="h5"
          width="35%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          Break
        </Typography>
      </Box>
    </MainDiv>
  );
};

PoolFormat.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  numGames: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  playoffTeams: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

PoolFormat.defaultProps = {
  onChange: () => {},
};

export default PoolFormat;
