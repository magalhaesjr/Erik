/* eslint-disable react/forbid-prop-types */
// Implements a basic table cell that allows editing
import { Button, Typography, Box } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CreateIcon from '@mui/icons-material/Create';
import DoneIcon from '@mui/icons-material/Done';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PropTypes from 'prop-types';
import MainDiv from '../MainDiv';

const TableAction = (props) => {
  const {
    activeEdit,
    onAdd,
    onEdit,
    onSave,
    onGenPools,
    waitList,
    poolsValid,
    divReady,
    divStatus,
  } = props;

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
  const genPools = () => {
    onGenPools();
  };

  return (
    <MainDiv display="flex">
      <MainDiv
        sx={{
          textAlign: 'left',
        }}
      >
        <Button onClick={handleAdd}>
          <AddBoxIcon />
          ADD
        </Button>
        {activeEdit ? (
          <Button align="right" onClick={handleSave}>
            <DoneIcon />
            UPDATE RANKS
          </Button>
        ) : (
          <Button align="right" onClick={handleEdit}>
            <CreateIcon />
            EDIT
          </Button>
        )}
        {!waitList && (
          <Button
            onClick={genPools}
            disabled={poolsValid || !divReady}
            sx={{
              color: 'green',
            }}
          >
            <LibraryBooksIcon />
            MAKE POOLS
          </Button>
        )}
        {!waitList && (
          <Box
            sx={{
              display: 'inline-flex',
              fontWeight: 'bold',
              alignContent: 'center',
              float: 'right',
            }}
          >
            <Typography
              variant="h8"
              sx={{
                color: divReady ? 'green' : 'red',
                display: 'inline-flex',
                textAlign: 'right',
                float: 'right',
              }}
            >
              {divStatus}
            </Typography>
          </Box>
        )}
      </MainDiv>
    </MainDiv>
  );
};

TableAction.propTypes = {
  onAdd: PropTypes.func,
  onSave: PropTypes.func,
  onEdit: PropTypes.func,
  onGenPools: PropTypes.func,
  activeEdit: PropTypes.bool,
  waitList: PropTypes.bool,
  poolsValid: PropTypes.bool,
  divReady: PropTypes.bool,
  divStatus: PropTypes.string,
};

TableAction.defaultProps = {
  onAdd: () => {},
  onSave: () => {},
  onEdit: () => {},
  onGenPools: () => {},
  activeEdit: false,
  waitList: false,
  poolsValid: false,
  divReady: false,
  divStatus: 'Unknown',
};

export default TableAction;
