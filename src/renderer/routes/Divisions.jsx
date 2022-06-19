import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, InputLabel, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import DivEntries from '../components/DivisionEntries';
import { hasProp } from '../../domain/validate';

// Divisions Page
const Divisions = (props) => {
  // Grab division from input props
  const { division } = props;
  // Declare state for this division component
  const [currentDiv, setDivision] = React.useState(division);

  // Callback
  const handleOnChange = (event) => {
    setDivision(event.target.value);
  };

  // Grabs selector from redux
  const divisions = useSelector((state) => {
    const div = {};
    // eslint-disable-next-line prettier/prettier
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day], 'divisions')) {
        Object.keys(state[day].divisions).forEach((name) => {
          div[name] = state[day].divisions[name];
        });
      }
    });
    return div;
  });

  return (
    <Box>
      <InputLabel>Division</InputLabel>
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
      <DivEntries division={currentDiv} waitList={false} key="entries" />
      <DivEntries division={currentDiv} waitList key="waitlist" />
    </Box>
  );
};

Divisions.propTypes = {
  division: PropTypes.string,
};
Divisions.defaultProps = {
  division: '',
};

export default Divisions;
