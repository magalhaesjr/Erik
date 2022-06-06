// Returns the pool sheet header table
import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material';

const PoolCell = styled(TableCell)(({ theme }) => ({
  fontSize: '8pt',
  fontWeight: 'bold',
  margin: '0px',
  padding: '0px',
  borderRadius: '0px',
  borderLeft: '1px solid black',
  borderBottom: '1px solid black',
  color: '#000000',
  background: '#ffffff',
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
        <TableRow>
          <PoolCell rowSpan={2}>{index + 1}</PoolCell>
          <PoolCell
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
              sx={{
                width: cellWidth,
              }}
            />
          ))}
          <PoolCell
            rowSpan={2}
            colSpan={3}
            sx={{
              borderLeft: '2px solid black',
            }}
          />
          <PoolCell rowSpan={2} colSpan={3} />
          <PoolCell
            rowSpan={2}
            colSpan={7}
            sx={{
              borderRight: '1px solid black',
            }}
          />
        </TableRow>
        <TableRow>
          <PoolCell
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
  cellWidth: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default TeamResults;
