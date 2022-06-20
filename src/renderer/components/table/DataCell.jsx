// Implements a basic table cell that allows editing
import TableCell from '@mui/material/TableCell';
import PropTypes from 'prop-types';

const DataCell = (props) => {
  const { data, name, immutable, onChange, align, activeEdit, sx } = props;

  const handleChange = (e) => {
    onChange(e);
  };

  // Return depends on edit parameter
  if (activeEdit && !immutable) {
    return (
      <TableCell align={align} sx={sx}>
        <input value={data} name={name} onChange={handleChange} />
      </TableCell>
    );
  }
  return (
    <TableCell align={align} sx={sx}>
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
