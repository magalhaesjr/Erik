// Returns the pool sheet header table
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material';

const PoolCell = styled(TableCell)(({ theme }) => ({
  fontSize: '8pt',
  margin: '0px',
  padding: '0px',
  borderRadius: '0px',
  borderBottom: '1px solid black',
  color: '#000000',
  background: '#ffffff',
  verticalAlign: 'middle',
  textAlign: 'center',
  height: '0.2in',
  overflow: 'hidden',
  flexShrink: '0',
}));

const PoolScore = (props) => {
  const { numGames, work } = props;

  return (
    <Table
      sx={{
        tableLayout: 'auto',
        overflow: 'hidden',
        width: '8.2in',
      }}
    >
      <TableBody>
        {[...Array(numGames)].map(() => (
          <Table
            sx={{
              tableLayout: 'auto',
              overflow: 'hidden',
              width: '8.2in',
            }}
          >
            <TableBody>
              <TableRow>
                <PoolCell
                  width="9%"
                  sx={{
                    borderLeft: '1px solid black',
                  }}
                />
                <PoolCell
                  rowSpan={2}
                  width="2%"
                  sx={{
                    borderLeft: '1px solid black',
                    borderRight: '1px solid black',
                  }}
                >
                  {work}
                </PoolCell>
                {[...Array(30)].map((_, index) => (
                  <PoolCell width="2.8%">{index + 1}</PoolCell>
                ))}
                <PoolCell
                  width="5%"
                  sx={{
                    borderLeft: '1px solid black',
                    borderRight: '1px solid black',
                  }}
                />
              </TableRow>
              <TableRow>
                <PoolCell
                  width="9%"
                  sx={{
                    borderLeft: '1px solid black',
                  }}
                />
                {[...Array(30)].map((_, index) => (
                  <PoolCell width="2.8%">{index + 1}</PoolCell>
                ))}
                <PoolCell
                  width="5%"
                  sx={{
                    borderLeft: '1px solid black',
                    borderRight: '1px solid black',
                  }}
                />
              </TableRow>
            </TableBody>
          </Table>
        ))}
      </TableBody>
    </Table>
  );
};

PoolScore.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  work: PropTypes.any.isRequired,
  numGames: PropTypes.number.isRequired,
};

export default PoolScore;
