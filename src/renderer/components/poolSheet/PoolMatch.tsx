// Returns the pool sheet header table
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { styled, TableHead } from '@mui/material';
import PoolScore from './PoolScore';
import Pool from '../../../domain/pool';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PoolCell = styled(TableCell)(() => ({
  fontSize: '8pt',
  fontWeight: 'bold',
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

type PoolMatchProps = {
  pool: Pool;
};

const PoolMatch = ({ pool }: PoolMatchProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <TableContainer width="8.2in">
      <Table
        sx={{
          tableLayout: 'auto',
          overflow: 'hidden',
          width: '8.2in',
        }}
      >
        <TableHead>
          <TableRow key="matchHeader">
            <PoolCell width="9%">Team</PoolCell>
            <PoolCell width="2%">W</PoolCell>
            <PoolCell width="84%" />
            <PoolCell width="5%">Pt Diff</PoolCell>
          </TableRow>
        </TableHead>
      </Table>
      {pool.schedule.map((match, round) => (
        <PoolScore
          numGames={pool.numGames}
          work={match.work}
          // eslint-disable-next-line react/no-array-index-key
          key={`roundScore_${round}`}
        />
      ))}
      {[...Array(20)].map((_, round) => (
        <PoolScore
          numGames={1}
          work=""
          // eslint-disable-next-line react/no-array-index-key
          key={`extraScore_${round}`}
        />
      ))}
    </TableContainer>
  );
};

export default PoolMatch;
