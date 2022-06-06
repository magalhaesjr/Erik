// Returns the pool sheet header table
import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { styled } from '@mui/material';
import TeamResults from './TeamResults';

const PoolCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14pt',
  fontWeight: 'bold',
  margin: '0px',
  padding: '0px',
  borderRadius: '0px',
  borderTop: '2px solid black',
  borderBottom: '2px solid black',
  color: '#000000',
  background: '#ffffff',
  verticalAlign: 'middle',
  textAlign: 'center',
  width: '0.2in',
  height: '0.2in',
  overflow: 'hidden',
  flexShrink: '0',
}));

const teamWidth = (nTeams) => {
  const width = (2.4 / nTeams / 6.4) * 100;
  return `${width.toString()}%`;
};

const PoolResults = (props) => {
  const { teams } = props;

  return (
    <TableContainer
      sx={{
        tableLayout: 'max-content',
      }}
    >
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
            <PoolCell
              rowSpan={2}
              colSpan={7}
              sx={{
                borderLeft: '2px solid black',
              }}
            >
              TEAMS
            </PoolCell>
            {teams.map((_, index) => (
              <PoolCell
                rowSpan={2}
                sx={{
                  width: teamWidth(teams.length),
                }}
              >
                {index + 1}
              </PoolCell>
            ))}
            <PoolCell rowSpan={2} colSpan={3}>
              Win
            </PoolCell>
            <PoolCell rowSpan={2} colSpan={3}>
              Loss
            </PoolCell>
            <PoolCell
              rowSpan={2}
              colSpan={7}
              sx={{
                borderRight: '2px solid black',
              }}
            >
              Pt Diff
            </PoolCell>
          </TableRow>
        </TableBody>
      </Table>
      {teams.map((_, index) => (
        <TeamResults
          teams={teams}
          cellWidth={teamWidth(teams.length)}
          index={index}
        />
      ))}
    </TableContainer>
  );
};

PoolResults.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  teams: PropTypes.array.isRequired,
};

export default PoolResults;
