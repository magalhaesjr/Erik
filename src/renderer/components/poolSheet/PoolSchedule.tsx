// Returns the pool sheet header table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { styled, TableHead } from '@mui/material';
import { Pool } from '../../redux/pools';

/** Types */
export type PoolScheduleProps = {
  pool: Pool;
};

const PoolCell = styled(TableCell)(() => ({
  fontSize: '11pt',
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

const PoolSchedule = ({ pool }: PoolScheduleProps) => {
  return (
    <TableContainer sx={{ width: '1.2in' }}>
      <Table
        sx={{
          tableLayout: 'auto',
          overflow: 'hidden',
          width: '1.2in',
          border: '1px solid black',
        }}
      >
        <TableHead>
          <TableRow key="scheduleHeader">
            <PoolCell colSpan={3}>Play</PoolCell>
            <PoolCell>W</PoolCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pool.schedule.map((match, round) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={`match_${round}`}>
              <PoolCell>{match.team1}</PoolCell>
              <PoolCell
                sx={{
                  borderLeft: 'none',
                }}
              >
                v
              </PoolCell>
              <PoolCell
                sx={{
                  borderLeft: 'none',
                }}
              >
                {match.team2}
              </PoolCell>
              <PoolCell>{match.work}</PoolCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PoolSchedule;
