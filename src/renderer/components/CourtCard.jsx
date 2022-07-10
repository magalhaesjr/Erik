// Implements a court in the court map
import * as React from 'react';
import PropTypes from 'prop-types';
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
import { useSelector, useDispatch } from 'react-redux';
import { Net } from '../../domain/court';
import { hasProp, isObject } from '../../domain/validate';

// Colors for net heights
const cardColor = {
  men: 'rgba(0,109,249,0.76)',
  women: 'rgba(189,22,139,0.7)',
  invalid: '#ff0005',
  undefined: '#888888',
};

const defaultHeight = (court) => {
  if (court.netHeight === Net.MEN) {
    return -1;
  }
  if (court.netHeight === Net.WOMEN) {
    return 1;
  }
  return 0;
};

const courtText = {
  color: '#eeeeee',
};

const getColor = (court, divisions) => {
  if (court.netHeight === Net.UNDEFINED || court.division === 'Available') {
    return cardColor.undefined;
  }
  if (
    hasProp(divisions, court.division) &&
    court.netHeight !== divisions[court.division].netHeight
  ) {
    return cardColor.invalid;
  }
  if (court.netHeight === Net.MEN) {
    return cardColor.men;
  }
  if (court.netHeight === Net.WOMEN) {
    return cardColor.women;
  }
  return cardColor.invalid;
};

const divText = (divisions, divName) => {
  // Sets the select division text for a division

  // this div
  const division = divisions[divName];
  // Verify it's valid
  if (isObject(division) && hasProp(division, 'courts')) {
    // Calculate the number of courts that still must be assigned
    const remaining = division.nets - division.courts.length;

    if (remaining < 0) {
      return `${divName} (${Math.abs(remaining).toString()} too many)`;
    }
    return `${divName} (${remaining.toString()} remaining)`;
  }

  // Just return divname by default (for available)
  return divName;
};

const divColor = (divisions, divName) => {
  // Sets the select division text for a division

  // this div
  const division = divisions[divName];
  // Verify it's valid
  if (isObject(division) && hasProp(division, 'courts')) {
    // Calculate the number of courts that still must be assigned
    const remaining = division.nets - division.courts.length;

    if (remaining < 0) {
      return 'red';
    }

    if (remaining === 0) {
      return '#555555';
    }

    return 'green';
  }

  // Just return divname by default (for available)
  return '';
};

const CourtCard = (props) => {
  // Court number for this card
  const { courtNumber } = props;

  // Grabs selector from redux
  const { court, divisions } = useSelector((state) => {
    const out = {
      court: {},
      divisions: { Available: { netHeight: Net.UNDEFINED } },
    };
    Object.keys(state).forEach((prop) => {
      if (hasProp(state[prop], 'divisions')) {
        Object.keys(state[prop].divisions).forEach((name) => {
          out.divisions[name] = state[prop].divisions[name];
        });
      } else if (prop === 'courts') {
        [out.court] = state[prop].filter((c) => c.number === courtNumber);
      }
    });
    return out;
  });

  // Dispatching
  const dispatch = useDispatch();

  // Change in net height
  const setHeight = (event) => {
    // Copy court object
    const newCourt = JSON.parse(JSON.stringify(court));
    // Height
    switch (event.target.value) {
      case -1: {
        newCourt.netHeight = Net.MEN;
        break;
      }
      case 1: {
        newCourt.netHeight = Net.WOMEN;
        break;
      }
      default:
        newCourt.netHeight = Net.UNDEFINED;
    }

    // Dispatch the change to the store
    dispatch({
      type: 'updateCourt',
      payload: {
        court: newCourt,
      },
    });
  };

  // Change division
  const changeDivision = (event) => {
    // Copy court object
    const newCourt = JSON.parse(JSON.stringify(court));
    // Sets the division of the court
    newCourt.division = event.target.value;

    // If net height is unset, set it to the division default
    if (newCourt.netHeight === Net.UNDEFINED) {
      newCourt.netHeight = divisions[newCourt.division].netHeight;
    }

    // Dispatch the change to the store
    dispatch({
      type: 'updateCourt',
      payload: {
        court: newCourt,
      },
    });
  };

  return (
    <Card
      sx={{
        backgroundColor: getColor(court, divisions),
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
            onChange={(e) => {
              setHeight(e);
            }}
            min={-1}
            max={1}
            fontWeight="bold"
            sx={{
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
            onChange={(e) => {
              changeDivision(e);
            }}
          >
            {Object.keys(divisions).map((divName) => (
              <MenuItem
                key={divName}
                value={divName}
                sx={{
                  justifyContent: 'flex-end',
                  color: divColor(divisions, divName),
                }}
              >
                {divText(divisions, divName)}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </CardActions>
    </Card>
  );
};

CourtCard.propTypes = {
  courtNumber: PropTypes.number.isRequired,
};

export default CourtCard;
