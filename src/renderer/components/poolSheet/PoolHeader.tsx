// Returns the pool sheet header table
import { useCallback } from 'react';
import { Paper } from '@mui/material';
import PoolInfo from './PoolInfo';
import PoolFormat from './PoolFormat';
import PoolResults from './PoolResults';
import { Pool } from '../../redux/pools';

type PoolHeaderProps = {
  pool: Pool;
  onChange?: (playoffTeams: number) => void;
  onCourtChange?: (court: number) => void;
};

const PoolHeader = ({ pool, onChange, onCourtChange }: PoolHeaderProps) => {
  const handleChange = useCallback(
    (val: number) => {
      if (onChange) {
        onChange(val);
      }
    },
    [onChange]
  );
  const handleCourtChange = useCallback(
    (val: number) => {
      if (onCourtChange) {
        onCourtChange(val);
      }
    },
    [onCourtChange]
  );

  return (
    <Paper
      sx={{
        width: '6.4in',
        boxShadow: 'none',
      }}
    >
      <PoolInfo
        inputCourt={pool.courts}
        division={pool.division}
        onCourtChange={handleCourtChange}
      />
      <PoolFormat
        numGames={pool.format.numGames}
        points={pool.format.points}
        playoffTeams={pool.format.playoffTeams}
        onChange={handleChange}
      />
      <PoolResults teams={pool.teams} />
    </Paper>
  );
};

export default PoolHeader;
