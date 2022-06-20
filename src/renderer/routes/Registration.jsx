import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, InputLabel, Button, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import { getPools, hasProp } from '../../domain/validate';
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
  // Default division
  const location = useLocation();
  const { division } = location.state;

  // Grabs selector from redux
  const divisions = useSelector((state) => {
    const div = {};
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day], 'divisions')) {
        Object.keys(state[day].divisions).forEach((name) => {
          div[name] = state[day].divisions[name];
        });
      }
    });
    return div;
  });

  // Declare state for this division component
  const [currentDiv, setDivision] = React.useState(
    hasProp(divisions, division) ? division : ''
  );
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

  return (
    <Box>
      <InputLabel>Division</InputLabel>
      <Box display="inline-block" width="40%">
        <Button
          variant="outlined"
          label="Pools"
          component={Link}
          to="/pools"
          size="small"
          disabled={getPools(divisions[currentDiv]).length === 0}
          state={{
            allPools: getPools(divisions[currentDiv]),
            division: currentDiv,
            displayPool: 1,
          }}
          sx={{
            marginRight: '5px',
          }}
        >
          Pools
        </Button>
        <Button
          variant="outlined"
          label="Div"
          component={Link}
          to="/divisions"
          size="small"
          state={{
            division: currentDiv,
          }}
        >
          Division
        </Button>
      </Box>
      <Box display="inline-block" width="20%" textAlign="center">
        <Select
          id="division-select"
          value={currentDiv}
          label="Division"
          onChange={handleOnChange}
        >
          {Object.keys(divisions).map((divName) => (
            <MenuItem key={divName} value={divName}>
              {divName}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box display="inline-block" width="40%">
        <Button onClick={printSheet}>
          <PrintIcon />
          PRINT
        </Button>
      </Box>
      <RegSheet division={currentDiv} ref={printRef} />
    </Box>
  );
};

export default Registration;
