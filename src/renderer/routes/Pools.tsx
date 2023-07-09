import { ReactInstance, useCallback, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  InputLabel,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import isEqual from 'lodash/isEqual';
import { useAppSelector } from '../redux/hooks';
import PoolSheet from '../components/PoolSheet';
import MainDiv from '../components/MainDiv';
import { selectDivisions } from '../redux/entries';
import { selectDivisionPools } from '../redux/pools';
import { RootState } from '../redux/store';

/** Types */
type PoolProps = {
  division: string;
  displayPool: number;
};

const pageStyle = `
  @page {
    size: portrait;
    margin: 0px 0px 0px 0px;
  }

  @media all {
    .pagebreak {
      overflow: hidden;
      height: 0px;
    }
  }
  html {
    -webkit-print-color-adjust: exact;
  }
}
`;

// Pool Page
const Pools = () => {
  // Default division
  const location = useLocation();
  const { division, displayPool } = location.state as PoolProps;

  /** State */
  const divisions = useAppSelector(selectDivisions, isEqual);
  // Declare state for this division component
  const [currentDiv, setDivision] = useState(
    divisions.includes(division) ? division : ''
  );

  const selectPoolNumbers = useCallback(
    (state: RootState) => {
      const pools = selectDivisionPools(state, currentDiv);
      return pools.map((_, i) => i + 1);
    },
    [currentDiv]
  );
  const allPools = useAppSelector(selectPoolNumbers, isEqual);

  const [pool, setPool] = useState<string>(
    allPools.length > 0 ? `${displayPool}` : ''
  );

  // Reference for printing
  const printRef = useRef<ReactInstance | null>(null);

  // Callback
  const handleDivChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setDivision(event.target.value);
      // Default to first pool
      setPool('1');
    },
    [setDivision, setPool]
  );

  const handlePoolChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setPool(event.target.value);
    },
    [setPool]
  );

  const printSheet = useReactToPrint({
    content: () => printRef.current,
    pageStyle,
  });

  return (
    <Box>
      <Box display="inline-block" width="30%">
        <Button
          variant="outlined"
          key="division-btn"
          component={Link}
          to="/divisions"
          size="small"
          state={{
            division: currentDiv,
          }}
          sx={{
            marginRight: '5px',
          }}
        >
          Division
        </Button>
        <Button
          variant="outlined"
          key="registration-btn"
          component={Link}
          to="/registration"
          size="small"
          state={{
            division: currentDiv,
          }}
          sx={{
            marginRight: '5px',
          }}
        >
          Registration
        </Button>
      </Box>
      <Box display="inline-block" width="40%">
        <MainDiv sx={{ display: 'inline-flex', verticalAlign: 'middle' }}>
          <MainDiv>
            <InputLabel>Division</InputLabel>
            <Select
              id="division-select"
              value={currentDiv}
              label="Division"
              onChange={handleDivChange}
            >
              {divisions.map((divName) => (
                <MenuItem key={divName} value={divName}>
                  {divName}
                </MenuItem>
              ))}
            </Select>
          </MainDiv>
          <MainDiv>
            <InputLabel>Pool</InputLabel>
            <Select
              id="pool-select"
              value={pool}
              label="Pool"
              onChange={handlePoolChange}
            >
              {allPools.map((poolObj) => (
                <MenuItem key={poolObj} value={poolObj}>
                  {`Pool ${poolObj}`}
                </MenuItem>
              ))}
            </Select>
          </MainDiv>
          <Button onClick={printSheet}>
            <PrintIcon />
            PRINT
          </Button>
        </MainDiv>
      </Box>
      <Box display="inline-block" width="30%" />
      <PoolSheet division={currentDiv} poolId={Number(pool)} ref={printRef} />
    </Box>
  );
};
export default Pools;
