import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import DivEntries from '../components/DivisionEntries';
import { getPools, hasProp } from '../../domain/validate';

// Divisions Page
const Divisions = () => {
  // Default division
  const location = useLocation();
  const { division } = location.state;

  // Grabs selector from redux
  const { divisions } = useSelector((state) => {
    const out = {
      divisions: {},
    };
    // eslint-disable-next-line prettier/prettier
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day], 'divisions')) {
        Object.keys(state[day].divisions).forEach((name) => {
          out.divisions[name] = state[day].divisions[name];
        });
      }
    });
    return out;
  });

  // Declare state for this division component
  const [currentDiv, setDivision] = React.useState(
    hasProp(divisions, division) ? division : ''
  );

  // Callback
  const handleOnChange = (event) => {
    setDivision(event.target.value);
  };

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
          label="Reg"
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
          {Object.keys(divisions).map((divName) => (
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
