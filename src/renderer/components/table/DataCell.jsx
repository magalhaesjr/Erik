// Implements a basic table cell that allows editing
import TableCell from '@mui/material/TableCell';
import PropTypes from 'prop-types';

const DataCell = (props) => {
  const { data, name, immutable, onChange, align, activeEdit, fontWeight } =
    props;

  const handleChange = (e) => {
    onChange(e);
  };

  // Return depends on edit parameter
  if (activeEdit && !immutable) {
    return (
      <TableCell
        align={align}
        sx={{
          padding: '0px',
          fontWeight: { fontWeight },
        }}
      >
        <input value={data} name={name} onChange={handleChange} />
      </TableCell>
    );
  }
  return (
    <TableCell
      align={align}
      sx={{
        padding: '0px',
        fontWeight: { fontWeight },
      }}
    >
      {data}
    </TableCell>
  );
};

DataCell.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string,
  fontWeight: PropTypes.string,
  align: PropTypes.string,
  immutable: PropTypes.bool,
  activeEdit: PropTypes.bool,
  onChange: PropTypes.func,
};

DataCell.defaultProps = {
  immutable: false,
  fontWeight: 'normal',
  name: '',
  activeEdit: false,
  align: 'center',
  onChange: () => {},
};

export default DataCell;
