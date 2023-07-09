import { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useAppSelector } from '../redux/hooks';
import DivEntries from '../components/DivisionEntries';
import { selectDivisions } from '../redux/entries';

// Divisions Page
const Divisions = () => {
  // Default division
  const location = useLocation();
  const { division } = location.state as { division: string };

  // Grabs selector from redux
  const divisions = useAppSelector(selectDivisions, isEqual);

  // Declare state for this division component
  const [currentDiv, setDivision] = useState<string>(
    divisions.includes(division) ? division : ''
  );

  // Callback
  const handleOnChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setDivision(event.target.value);
    },
    [setDivision]
  );

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
          to="/registration"
          size="small"
          state={{
            division: currentDiv,
          }}
        >
          Registration
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
      <Box display="inline-block" width="40%" />
      <DivEntries division={currentDiv} waitList={false} key="entries" />
      <DivEntries division={currentDiv} waitList key="waitlist" />
    </Box>
  );
};

export default Divisions;
