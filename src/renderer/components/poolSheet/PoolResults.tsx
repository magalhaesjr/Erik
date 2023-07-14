// Returns the pool sheet header table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { styled } from '@mui/material';
import TeamResults from './TeamResults';
import { TeamEntry } from '../../redux/entries';

/** Types */
export type PoolResultsProps = {
  teams: TeamEntry[];
};

/** Styles */
const PoolCell = styled(TableCell)(() => ({
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

/** Static callbacks */
const teamWidth = (nTeams: number) => {
  const width = (2.4 / nTeams / 6.4) * 100;
  return `${width.toString()}%`;
};

const PoolResults = ({ teams }: PoolResultsProps) => {
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
          <TableRow key="poolHeader">
            <PoolCell
              rowSpan={2}
              colSpan={7}
              key="teamHeader"
              sx={{
                borderLeft: '2px solid black',
              }}
            >
              TEAMS
            </PoolCell>
            {teams.map((_, index) => (
              <PoolCell
                rowSpan={2}
                key={`team_${index + 1}`}
                sx={{
                  width: teamWidth(teams.length),
                }}
              >
                {index + 1}
              </PoolCell>
            ))}
            <PoolCell rowSpan={2} colSpan={3} key="win">
              Win
            </PoolCell>
            <PoolCell rowSpan={2} colSpan={3} key="loss">
              Loss
            </PoolCell>
            <PoolCell
              rowSpan={2}
              colSpan={7}
              key="ptDiff"
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
          // eslint-disable-next-line react/no-array-index-key
          key={`teamResults_${index}`}
        />
      ))}
    </TableContainer>
  );
};

export default PoolResults;
