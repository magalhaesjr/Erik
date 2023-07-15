// Returns the pool sheet header table
import { useCallback } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import MainDiv from '../MainDiv';

export type PoolFormatProps = {
  numGames: number;
  points: number;
  playoffTeams: number;
  onChange: (value: number) => void;
};
const PoolFormat = ({
  numGames,
  points,
  playoffTeams,
  onChange,
}: PoolFormatProps) => {
  /** Callbacks */
  const handlePlayoffChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      onChange(Number(event.target.value));
    },
    [onChange]
  );

  return (
    <MainDiv>
      {numGames === 1 ? (
        <Typography
          variant="h5"
          width="50%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          {`${numGames} Game to ${points} Points`}
        </Typography>
      ) : (
        <Typography
          variant="h5"
          width="50%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          {`${numGames} Games to ${points} Points`}
        </Typography>
      )}
      <Box width="50%">
        <Typography
          variant="h5"
          width="35%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          Top
        </Typography>
        <Select
          id="playoff-select"
          value={`${playoffTeams}`}
          onChange={handlePlayoffChange}
          variant="standard"
        >
          <MenuItem value={2}>
            <Typography variant="h4">2</Typography>
          </MenuItem>
          <MenuItem value={3}>
            <Typography variant="h4">3</Typography>
          </MenuItem>
          <MenuItem value={4}>
            <Typography variant="h4">4</Typography>
          </MenuItem>
        </Select>
        <Typography
          variant="h5"
          width="35%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          Break
        </Typography>
      </Box>
    </MainDiv>
  );
};

export default PoolFormat;
