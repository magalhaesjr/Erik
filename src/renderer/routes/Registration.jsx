import * as React from 'react';
import { Box, InputLabel, Button, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import RegSheet from '../components/RegSheet';

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

// Registration Page
const Registration = () => {
  // Declare state for this division component
  const [division, setDivision] = React.useState('');
  const [mode, setMode] = React.useState('form');
  // Reference for printing
  const printRef = React.useRef();

  // Callback
  const handleOnChange = (event) => {
    setDivision(event.target.value);
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
      <InputLabel>Division</InputLabel>
      <Select
        id="division-select"
        value={division}
        label="Division"
        onChange={handleOnChange}
      >
        {Object.keys(divisions).map((divName) => (
          <MenuItem key={divName} value={divName}>
            {divName}
          </MenuItem>
        ))}
      </Select>
      <Button onClick={printSheet}>
        <PrintIcon />
        PRINT
      </Button>
      <RegSheet division={division} ref={printRef} mode={mode} />
    </Box>
  );
};

export default Registration;
