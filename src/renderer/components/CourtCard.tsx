// Implements a court in the court map
import { useCallback } from 'react';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  MenuItem,
  Typography,
  Slider,
  Box,
  Select,
} from '@mui/material';
import isEqual from 'lodash/isEqual';
import { RootState } from 'renderer/redux/store';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { Court } from '../../domain/court';
import { RequiredCourts } from '../redux/rules';
import {
  ChangeDivisionPayload,
  ChangeHeightPayload,
  selectCourt,
  updateCourt,
} from '../redux/courts';
import { selectDivisions } from '../redux/entries';

/** Types */
export type DivisionRequired = {
  [key: string]: RequiredCourts;
};

export type DivisionCourts = {
  [key: string]: number;
};

export type CourtCardProps = {
  courtNumber: number;
  divisionNets: DivisionRequired;
  divisionCourts: DivisionCourts;
};

/** Styles */
// Colors for net heights
const cardColor = {
  men: 'rgba(0,109,249,0.76)',
  women: 'rgba(189,22,139,0.7)',
  invalid: '#ff0005',
  undefined: '#888888',
};

/** Static Callbacks */
const defaultHeight = (court: Court) => {
  if (court.netHeight === 'men') {
    return -1;
  }
  if (court.netHeight === 'women') {
    return 1;
  }
  return 0;
};

const courtText = {
  color: '#eeeeee',
};

const getColor = (court: Court) => {
  if (court.netHeight === 'undefined' || court.division === '') {
    return cardColor.undefined;
  }

  const divNet = court.division[0] === 'm' ? 'men' : 'women';

  if (court.netHeight !== divNet) {
    return cardColor.invalid;
  }
  if (court.netHeight === 'men') {
    return cardColor.men;
  }
  if (court.netHeight === 'women') {
    return cardColor.women;
  }

  return cardColor.invalid;
};

const divText = (required: RequiredCourts, numCourts: number) => {
  const { minNets, maxNets } = required;
  // Verify it's valid
  // Calculate the number of courts that still must be assigned
  const minRemaining = minNets - numCourts;
  const maxRemaining = maxNets - numCourts;

  if (maxRemaining < 0) {
    return `(${Math.abs(maxRemaining)} too many)`;
  }

  if (minRemaining <= 0 && maxRemaining === 0) {
    return '(0 remaining)';
  }

  if (minRemaining === maxRemaining) {
    return `(${maxRemaining} remaining)`;
  }

  return `(${Math.max(0, minRemaining)} or ${maxRemaining} remaining)`;
};

const divColor = (required: RequiredCourts, numCourts: number) => {
  // Sets the select division text for a division
  const { minNets, maxNets } = required;

  // Calculate the number of courts that still must be assigned
  const remaining = minNets - numCourts;

  if (remaining <= 0 && numCourts <= maxNets) {
    return '#555555';
  }

  if (remaining < 0) {
    return 'red';
  }

  return 'green';
};

const CourtCard = ({
  courtNumber,
  divisionNets,
  divisionCourts,
}: CourtCardProps) => {
  /** State */
  const divisions = useAppSelector(selectDivisions, isEqual);
  const selectThisCourt = useCallback(
    (state: RootState) => selectCourt(state, courtNumber),
    [courtNumber]
  );
  const court = useAppSelector(selectThisCourt, isEqual);
  // Dispatching
  const dispatch = useAppDispatch();

  /** Callbacks */
  const setHeight = useCallback(
    (event) => {
      const heightChange: ChangeHeightPayload = {
        court: courtNumber,
        netHeight: 'undefined',
      };

      // Height
      if (event.target.value === -1) {
        heightChange.netHeight = 'men';
      }
      if (event.target.value === 1) {
        heightChange.netHeight = 'women';
      }

      // Dispatch the change to the store
      dispatch(updateCourt('changeHeight', heightChange));
    },
    [dispatch, courtNumber]
  );

  const setDivision = useCallback(
    (event) => {
      const divChange: ChangeDivisionPayload = {
        court: courtNumber,
        division: event.target.value,
      };

      if (event.target.value === 'Available') {
        divChange.division = '';
      }

      // Dispatch the change to the store
      dispatch(updateCourt('changeDivision', divChange));

      // Change the net height too if undefined
      if (
        (court as Court).netHeight === 'undefined' &&
        divChange.division !== ''
      ) {
        const heightChange: ChangeHeightPayload = {
          court: courtNumber,
          netHeight: divChange.division[0] === 'm' ? 'men' : 'women',
        };
        dispatch(updateCourt('changeHeight', heightChange));
      }
    },
    [dispatch, courtNumber, court]
  );

  return (
    <>
      {court && (
        <Card
          sx={{
            backgroundColor: getColor(court),
          }}
        >
          <CardHeader title={`Court ${courtNumber}`} sx={{ ...courtText }} />
          <CardContent>
            <Typography variant="h4" sx={{ ...courtText }}>
              {court.division.length > 0 ? court.division : 'Available'}
            </Typography>
            <Typography variant="h5" sx={{ ...courtText }}>
              {court.pool !== null ? `Pool: ${court.pool}` : 'Pool: Unassigned'}
            </Typography>
          </CardContent>
          <CardActions>
            <Box width="10%" />
            <Box width="25%">
              <Slider
                value={defaultHeight(court)}
                step={null}
                marks={[
                  { value: -1, label: 'M' },
                  { value: 0, label: '' },
                  { value: 1, label: 'W' },
                ]}
                onChange={setHeight}
                min={-1}
                max={1}
                sx={{
                  fontWeight: 'bold',
                  color: '#eeeeee',
                  '& .MuiSlider-markLabel': {
                    color: '#eeeeee',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>
            <Box width="65%">
              <Select
                id="division-select"
                value=""
                variant="standard"
                sx={{ ...courtText }}
                onChange={setDivision}
              >
                {['Available', ...divisions].map((divName) => (
                  <MenuItem
                    key={divName}
                    value={divName}
                    sx={{
                      justifyContent: 'flex-end',
                      color:
                        divName === 'Available'
                          ? '#555555'
                          : divColor(
                              divisionNets[divName],
                              divisionCourts[divName]
                            ),
                    }}
                  >
                    {divName === 'Available'
                      ? 'Available'
                      : `${divName} ${divText(
                          divisionNets[divName],
                          divisionCourts[divName]
                        )}`}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default CourtCard;
