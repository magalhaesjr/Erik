// Implements a basic table cell that allows editing
import { Button, Typography, Box } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MainDiv from '../MainDiv';

/** Types */
export type TableActionProps = {
  onAdd: () => void;
  onGenPools: () => void;
  waitList: boolean;
  poolsValid: boolean;
  divReady: boolean;
  divStatus: string;
};

const TableAction = ({
  onAdd,
  onGenPools,
  waitList,
  poolsValid,
  divReady,
  divStatus,
}: TableActionProps) => {
  return (
    <MainDiv sx={{ display: 'flex' }}>
      <MainDiv
        sx={{
          textAlign: 'left',
        }}
      >
        <Button onClick={onAdd}>
          <AddBoxIcon />
          ADD
        </Button>
        {!waitList && (
          <Button
            onClick={onGenPools}
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
              variant="body1"
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

export default TableAction;
