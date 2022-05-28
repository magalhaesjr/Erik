// Implements a basic table cell that allows editing
import TableCell from '@mui/material/TableCell';
import PropTypes from 'prop-types';

const DataCell = (props) => {
  const { data, immutable, handleChange, align, activeEdit } = props;

  // Return depends on edit parameter
  if (activeEdit && !immutable) {
    return (
      <TableCell align={align}>
        <input value={data} onChange={handleChange} />
      </TableCell>
    );
  }
  return <TableCell align={align}>{data}</TableCell>;
};

DataCell.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  align: PropTypes.string,
  immutable: PropTypes.bool,
  activeEdit: PropTypes.bool,
  handleChange: PropTypes.func,
};

DataCell.defaultProps = {
  immutable: false,
  activeEdit: false,
  align: 'center',
  handleChange: () => {},
};

export default DataCell;
