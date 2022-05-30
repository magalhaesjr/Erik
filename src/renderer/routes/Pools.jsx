import * as React from 'react';
import { Box, InputLabel, Button, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import PoolSheet from '../components/PoolSheet';
import MainDiv from '../components/MainDiv';

const pageStyle = `
  @page {
    size: landscape;
    margin: 0px 0px 0px 0px;
  }

  @media all {
    .pagebreak {
      overflow: hidden;
      height: 0px;
    }
  }
`;

// Pool Page
const Pools = () => {
  // Declare state for this division component
  const [division, setDivision] = React.useState('');
  const [pool, setPool] = React.useState('');
  // Reference for printing
  const printRef = React.useRef();

  // Callback
  const handleDivChange = (event) => {
    setDivision(event.target.value);
  };
  const handlePoolChange = (event) => {
    setPool(event.target.value);
  };

  const printSheet = useReactToPrint({
    content: () => printRef.current,
    pageStyle,
  });

  // Grabs selector from redux
  const divisions = useSelector((state) => {
    const div = {};
    Object.keys(state).forEach((day) => {
      Object.keys(state[day].divisions).forEach((name) => {
        div[name] = state[day].divisions[name];
      });
    });
    return div;
  });

  return (
    <Box>
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
        <InputLabel>Pool</InputLabel>
        <Select
          id="pool-select"
          value={pool}
          label="Pool"
          onChange={handlePoolChange}
        >
          {Object.keys(pool).map((poolNum) => (
            <MenuItem key={poolNum} value={poolNum}>
              {`Pool ${poolNum}`}
            </MenuItem>
          ))}
        </Select>
      </MainDiv>
      <Button onClick={printSheet}>
        <PrintIcon />
        PRINT
      </Button>
      <PoolSheet division={division} pool={pool} ref={printRef} />
    </Box>
  );
};

export default Pools;
