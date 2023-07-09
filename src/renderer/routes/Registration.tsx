import { ReactInstance, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  InputLabel,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import isEqual from 'lodash/isEqual';
import { useAppSelector } from '../redux/hooks';
import RegSheet from '../components/RegSheet';
import { selectDivisions } from '../redux/entries';

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
  const { division } = location.state as { division: string };

  const divisions = useAppSelector(selectDivisions, isEqual);

  // Declare state for this division component
  const [currentDiv, setDivision] = useState<string>(
    divisions.includes(division) ? division : ''
  );
  // Reference for printing
  const printRef = useRef<ReactInstance | null>(null);

  // Callback
  const handleOnChange = (event: SelectChangeEvent<string>) => {
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
          component={Link}
          to="/pools"
          size="small"
          disabled
          state={{
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
          {divisions.map((divName) => (
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
