// Returns the pool sheet header table
import * as React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import MainDiv from '../MainDiv';

const PoolInfo = (props) => {
  const { inputCourt, division } = props;

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
        {`Court ${inputCourt}`}
      </Typography>
    </MainDiv>
  );
};

PoolInfo.propTypes = {
  inputCourt: PropTypes.number.isRequired,
  division: PropTypes.string.isRequired,
};

export default PoolInfo;
