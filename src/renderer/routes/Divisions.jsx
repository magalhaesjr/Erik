// Footer for main page
import * as React from 'react';
import { Box, InputLabel, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import DivEntries from '../components/DivisionEntries';

// Divisions Page
const Divisions = () => {
  // Declare state for this division component
  const [division, setDivision] = React.useState('');

  // Callback
  const handleOnChange = (event) => {
    setDivision(event.target.value);
  };

  // Grabs selector from redux
  const divisions = useSelector((state) => {
    const div = {};
    Object.keys(state.saturday.divisions).forEach((name) => {
      div[name] = state.saturday.divisions[name];
    });
    Object.keys(state.sunday.divisions).forEach((name) => {
      div[name] = state.sunday.divisions[name];
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
      <DivEntries division={division} waitList={false} />
      <DivEntries division={division} waitList />
    </Box>
  );
};

export default Divisions;
