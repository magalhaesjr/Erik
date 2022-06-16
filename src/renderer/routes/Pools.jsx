import * as React from 'react';
import { Box, InputLabel, Button, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import { hasProp } from '../../domain/validate';
import PoolSheet from '../components/PoolSheet';
import MainDiv from '../components/MainDiv';

const pageStyle = `
  @page {
    size: portrait;
    margin: 0px 0px 0px 0px;
  }

  @media all {
    .pagebreak {
      overflow: hidden;
      height: 0px;
    }
  }
  html {
    -webkit-print-color-adjust: exact;
  }
}
`;

// Pool Page
const Pools = () => {
  // Declare state for this division component
  const [division, setDivision] = React.useState('');
  const [availablePools, setAvailable] = React.useState([]);
  const [pool, setPool] = React.useState('');
  // Reference for printing
  const printRef = React.useRef();

  // Grabs selector from redux
  const divisions = useSelector((state) => {
    const div = {};
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day], 'divisions')) {
        Object.keys(state[day].divisions).forEach((name) => {
          if (state[day].divisions[name].pools.length > 0) {
            div[name] = state[day].divisions[name];
          }
        });
      }
    });
    return div;
  });

  // Callback
  const handleDivChange = (event) => {
    setDivision(event.target.value);
    // set available pools
    const divPools = Array.from(
      Array(divisions[event.target.value].pools.length),
      (_, index) => {
        return index + 1;
      }
    );
    setAvailable(divPools);
    // Default to first pool
    setPool(1);
  };
  const handlePoolChange = (event) => {
    setPool(event.target.value);
  };

  const printSheet = useReactToPrint({
    content: () => printRef.current,
    pageStyle,
  });

  return (
    <Box>
      <MainDiv sx={{ display: 'inline-flex', verticalAlign: 'middle' }}>
        <MainDiv>
          <InputLabel>Division</InputLabel>
          <Select
            id="division-select"
            value={division}
            label="Division"
            onChange={handleDivChange}
          >
            {Object.keys(divisions).map((divName) => (
              <MenuItem key={divName} value={divName}>
                {divName}
              </MenuItem>
            ))}
          </Select>
        </MainDiv>
        <MainDiv>
          <InputLabel>Pool</InputLabel>
          <Select
            id="pool-select"
            value={pool}
            label="Pool"
            onChange={handlePoolChange}
          >
            {availablePools.map((poolObj) => (
              <MenuItem key={poolObj} value={poolObj}>
                {`Pool ${poolObj}`}
              </MenuItem>
            ))}
          </Select>
        </MainDiv>
      </MainDiv>
      <Button onClick={printSheet}>
        <PrintIcon />
        PRINT
      </Button>
      <PoolSheet division={division} poolId={pool - 1} ref={printRef} />
    </Box>
  );
};

export default Pools;
