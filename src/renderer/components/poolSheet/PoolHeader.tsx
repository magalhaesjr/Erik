// Returns the pool sheet header table
import { Paper } from '@mui/material';
import PoolInfo from './PoolInfo';
import PoolFormat from './PoolFormat';
import PoolResults from './PoolResults';
import Pool from '../../../domain/pool';

type PoolHeaderProps = {
  pool: Pool;
  onChange?: (playoffTeams: number) => void;
};

const PoolHeader = ({ pool, onChange }: PoolHeaderProps) => {
  const handleChange = (val: number) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <Paper
      sx={{
        width: '6.4in',
        boxShadow: 'none',
      }}
    >
      <PoolInfo inputCourt={pool.courts} division={pool.division} />
      <PoolFormat
        numGames={pool.numGames}
        points={pool.points}
        playoffTeams={pool.playoffTeams}
        onChange={handleChange}
      />
      <PoolResults teams={pool.teams} />
    </Paper>
  );
};

export default PoolHeader;
