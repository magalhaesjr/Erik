// Returns the pool sheet header table
import { useCallback } from 'react';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useAppSelector } from 'renderer/redux/hooks';
import MainDiv from '../MainDiv';
import { selectDivisionCourts } from '../../redux/courts';
import { RootState } from '../../redux/store';

type PoolInfoProps = {
  inputCourt: number[];
  division: string;
  onCourtChange: (value: number) => void;
};

const PoolInfo = ({ inputCourt, division, onCourtChange }: PoolInfoProps) => {
  /** Redux State */
  const selectCourts = useCallback(
    (state: RootState) =>
      selectDivisionCourts(state, division)
        .map((c) => c.number)
        .filter((c) => c !== null) as number[],
    [division]
  );

  const divCourts = useAppSelector(selectCourts, isEqual);

  const handleCourtChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      onCourtChange(Number(event.target.value));
    },
    [onCourtChange]
  );

  return (
    <MainDiv sx={{ display: 'flex' }}>
      <Typography
        variant="h4"
        width="50%"
        sx={{
          color: 'black',
          display: 'inline-block',
        }}
      >
        {division}
      </Typography>
      <Box width="40%">
        <Typography
          variant="h4"
          width="50%"
          sx={{
            color: 'black',
            display: 'inline-block',
          }}
        >
          Court
        </Typography>
        <Select
          id="court-select"
          value={`${inputCourt[0]}`}
          onChange={handleCourtChange}
          variant="standard"
        >
          {divCourts.map((c) => (
            <MenuItem key={`court-item/${c}`} value={`${c}`}>
              <Typography
                key={`court-num/${c}`}
                variant="h4"
              >{`${c}`}</Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>
    </MainDiv>
  );
};

export default PoolInfo;
