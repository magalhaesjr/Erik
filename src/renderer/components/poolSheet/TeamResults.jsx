// Returns the pool sheet header table
import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material';

const validMatch = '#ffffff';
const invalidMatch = '#555555';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PoolCell = styled(TableCell)(({ theme }) => ({
  fontSize: '8pt',
  fontWeight: 'bold',
  margin: '0px',
  padding: '0px',
  borderRadius: '0px',
  borderLeft: '1px solid black',
  borderBottom: '1px solid black',
  color: '#000000',
  background: validMatch,
  verticalAlign: 'middle',
  textAlign: 'center',
  width: '0.2in',
  height: '0.2in',
  overflow: 'hidden',
  flexShrink: '0',
}));

const TeamResults = (props) => {
  const { teams, cellWidth, index } = props;

  return (
    <Table
      sx={{
        tableLayout: 'auto',
        overflow: 'hidden',
        width: '6.4in',
        border: '1px solid black',
      }}
    >
      <TableBody>
        <TableRow key="player1">
          <PoolCell rowSpan={2} key="player1Seed">
            {index + 1}
          </PoolCell>
          <PoolCell
            key="player1Name"
            sx={{
              width: '21.875%',
            }}
          >
            {teams[index].players[0].firstName.concat(
              ' ',
              teams[index].players[0].lastName
            )}
          </PoolCell>
          {teams.map((_, i) => (
            <PoolCell
              rowSpan={2}
              // eslint-disable-next-line react/no-array-index-key
              key={`teamResult_${index}_${i}`}
              sx={{
                width: cellWidth,
                background: index === i ? invalidMatch : validMatch,
              }}
            />
          ))}
          <PoolCell
            rowSpan={2}
            colSpan={3}
            key="Win"
            sx={{
              borderLeft: '2px solid black',
            }}
          />
          <PoolCell rowSpan={2} colSpan={3} key="Loss" />
          <PoolCell
            rowSpan={2}
            colSpan={7}
            key="Points"
            sx={{
              borderRight: '1px solid black',
            }}
          />
        </TableRow>
        <TableRow key="player2">
          <PoolCell
            key="player2Name"
            sx={{
              width: '21.875%',
            }}
          >
            {teams[index].players[1].firstName.concat(
              ' ',
              teams[index].players[1].lastName
            )}
          </PoolCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

TeamResults.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  teams: PropTypes.array.isRequired,
  cellWidth: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default TeamResults;
