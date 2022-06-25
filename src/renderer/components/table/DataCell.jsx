// Implements a basic table cell that allows editing
import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import PropTypes from 'prop-types';

const DataCell = (props) => {
  const { data, name, immutable, onChange, align, activeEdit, sx } = props;

  const [value, setValue] = React.useState(data);

  const handleChange = (e) => {
    onChange(e);
  };

  const updateState = (e) => {
    setValue(e.target.value);
  };

  // Return depends on edit parameter
  if (activeEdit && !immutable) {
    return (
      <TableCell key="nameEdit" align={align} sx={sx}>
        <input
          key="nameInput"
          value={value}
          name={name}
          onChange={updateState}
          onBlur={handleChange}
        />
      </TableCell>
    );
  }
  return (
    <TableCell align={align} key="nameDisplay" sx={sx}>
      {data}
    </TableCell>
  );
};

DataCell.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string,
  align: PropTypes.string,
  immutable: PropTypes.bool,
  activeEdit: PropTypes.bool,
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
};

DataCell.defaultProps = {
  immutable: false,
  name: '',
  activeEdit: false,
  align: 'center',
  sx: { padding: '0px' },
  onChange: () => {},
};

export default DataCell;
