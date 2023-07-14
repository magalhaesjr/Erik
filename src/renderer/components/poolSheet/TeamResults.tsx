// Returns the pool sheet header table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material';
import { TeamEntry } from '../../redux/entries';

/** Types */
export type TeamResultsProps = {
  teams: TeamEntry[];
  cellWidth: string;
  index: number;
};

/** Styling */
const validMatch = '#ffffff';
const invalidMatch = '#555555';

const PoolCell = styled(TableCell)(() => ({
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

const TeamResults = ({ teams, cellWidth, index }: TeamResultsProps) => {
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
            {teams[index].players[0].name.full}
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
            {teams[index].players[1].name.full}
          </PoolCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TeamResults;
