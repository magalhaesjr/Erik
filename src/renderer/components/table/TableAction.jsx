/* eslint-disable react/forbid-prop-types */
// Implements a basic table cell that allows editing
import { Button } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CreateIcon from '@mui/icons-material/Create';
import DoneIcon from '@mui/icons-material/Done';
import PropTypes from 'prop-types';
import MainDiv from '../MainDiv';

const TableAction = (props) => {
  const { activeEdit, onAdd, onEdit, onSave, rows } = props;

  // Handlers
  const handleEdit = (event) => {
    onEdit(event.target.value);
  };
  const handleAdd = (event) => {
    onAdd(event.target.value);
  };
  const handleSave = (event) => {
    onSave(event.target.value);
  };

  if (activeEdit) {
    return (
      <MainDiv display="flex">
        <MainDiv
          sx={{
            textAlign: 'left',
          }}
        >
          <Button onClick={handleAdd}>
            <AddBoxIcon onClick={handleAdd} />
            ADD
          </Button>
          <Button align="right" onClick={handleSave}>
            <DoneIcon />
            UPDATE RANKS
          </Button>
        </MainDiv>
      </MainDiv>
    );
  }
  return (
    <MainDiv display="flex">
      <MainDiv
        sx={{
          textAlign: 'left',
        }}
      >
        <Button onClick={handleAdd}>
          <AddBoxIcon onClick={handleAdd} />
          ADD
        </Button>
        <Button align="right" onClick={handleEdit}>
          <CreateIcon />
          EDIT
        </Button>
      </MainDiv>
    </MainDiv>
  );
};

TableAction.propTypes = {
  onAdd: PropTypes.func,
  onSave: PropTypes.func,
  onEdit: PropTypes.func,
  rows: PropTypes.number,
  activeEdit: PropTypes.bool,
};

TableAction.defaultProps = {
  onAdd: () => {},
  onSave: () => {},
  onEdit: () => {},
  rows: 0,
  activeEdit: false,
};

export default TableAction;
