// Returns the pool sheet header table
import * as React from 'react';
import PropTypes from 'prop-types';
import { Typography, TextField } from '@mui/material';
import MainDiv from '../MainDiv';

const PoolInfo = (props) => {
  const { inputCourt, division } = props;
  const [court, setCourt] = React.useState(inputCourt);

  const changeCourt = (e) => {
    setCourt(e.target.value);
  };

  return (
    <MainDiv>
      <Typography
        variant="h4"
        width="50%"
        sx={{
          color: 'black',
          display: 'inline-block',
        }}
      >
        {division}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: 'black',
          display: 'inline-block',
        }}
      >
        Court
      </Typography>
    </MainDiv>
  );
};

/*
      <TextField
        value={court}
        variant="outlined"
        onChange={(e) => changeCourt(e)}
        sx={{
          fontSize: '20pt',
          marginTop: '4px',
          marginBottom: '0px',
          padding: '0px',
          border: 'none',
        }}
      />
  */
PoolInfo.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  inputCourt: PropTypes.number.isRequired,
  division: PropTypes.string.isRequired,
};

export default PoolInfo;
