import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, InputLabel, Button, MenuItem, Select } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import { useAppSelector } from '../redux/hooks';
import { hasProp } from '../../domain/validate';
import PoolSheet from '../components/PoolSheet';
import MainDiv from '../components/MainDiv';

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
  const { allPools, division, displayPool } = location.state;

  /** TODO: REPLACE ME */
  const divisions = useAppSelector((rootState) => {
    const state = rootState.tournament;
    const div = {};
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day], 'divisions')) {
        Object.keys(state[day].divisions).forEach((name) => {
          if (state[day].divisions[name].props.pools.length > 0) {
            div[name] = state[day].divisions[name];
          }
        });
      }
    });
    return div;
  });
  /** END REPLACE */

  // Declare state for this division component
  const [currentDiv, setDivision] = React.useState(
    hasProp(divisions, division) ? division : ''
  );
  const [availablePools, setAvailable] = React.useState(
    allPools.length > 0 ? allPools : []
  );
  const [pool, setPool] = React.useState(
    allPools.length > 0 ? displayPool : ''
  );
  // Reference for printing
  const printRef = React.useRef();
  // Callback
  const handleDivChange = (event) => {
    setDivision(event.target.value);
    // set available pools
    const divPools = Array.from(
      Array(divisions[event.target.value].props.pools.length),
      (_, index) => {
        return index + 1;
      }
    );
    setAvailable(divPools);
    // Default to first pool
    setPool(1);
  };
  const handlePoolChange = (event) => {
    setPool(event.target.value);
  };

  const printSheet = useReactToPrint({
    content: () => printRef.current,
    pageStyle,
  });

  return (
    <Box>
      <Box display="inline-block" width="30%">
        <Button
          variant="outlined"
          label="Div"
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
          label="Reg"
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
              {Object.keys(divisions).map((divName) => (
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
              {availablePools.map((poolObj) => (
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
      <PoolSheet division={currentDiv} poolId={pool - 1} ref={printRef} />
    </Box>
  );
};
export default Pools;
