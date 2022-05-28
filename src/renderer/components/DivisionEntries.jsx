// Creates a React table for all entries into division
import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import DataCell from './table/DataCell';

// Creates the player name for the table
const playerName = (player) => {
  return player.firstName.concat(' ', player.lastName);
};

// Creates a table entry row
const createRow = (
  seed,
  rank,
  p1Name,
  p1Rank,
  p1Avpa,
  p2Name,
  p2Rank,
  p2Avpa
) => {
  return { seed, rank, p1Name, p1Rank, p1Avpa, p2Name, p2Rank, p2Avpa };
};

// Adds team entries to the division state
const addTeams = (division, teams, waitList) => {
  if (waitList) {
    division.waitList.forEach((team) => {
      teams.push(
        createRow(
          team.seed,
          team.ranking,
          playerName(team.players[0]),
          team.players[0].ranking,
          team.players[0].avpa,
          playerName(team.players[1]),
          team.players[1].ranking,
          team.players[1].avpa
        )
      );
    });
  } else {
    division.teams.forEach((team) => {
      teams.push(
        createRow(
          team.seed,
          team.ranking,
          playerName(team.players[0]),
          team.players[0].ranking,
          team.players[0].avpa,
          playerName(team.players[1]),
          team.players[1].ranking,
          team.players[1].avpa
        )
      );
    });
  }
  return teams;
};

// Specifies the label for the table
const label = (waitList) => {
  if (waitList) {
    return 'Wait List';
  }
  return 'Entries';
};
// Specifies the label for the header column
const keyLabel = (waitList) => {
  if (waitList) {
    return 'Position';
  }
  return 'Seed';
};

const DivEntries = (props) => {
  // Grabs the state from store

  const { division, waitList } = props;
  // State
  const { activeEdit, setEdit } = React.useState(false);
  // Grabs selector from redux
  const entries = useSelector((state) => {
    let teams = [];
    // eslint-disable-next-line prettier/prettier
    if ( Object.prototype.hasOwnProperty.call(state.saturday.divisions, division)) {
      teams = addTeams(state.saturday.divisions[division], teams, waitList);
      // eslint-disable-next-line prettier/prettier
    } else if ( Object.prototype.hasOwnProperty.call(state.sunday.divisions, division)) {
      teams = addTeams(state.sunday.divisions[division], teams, waitList);
    }
    return teams;
  });

  if (entries.length > 0) {
    return (
      <TableContainer component={Paper}>
        <Typography variant="h6" align="left">
          {label(waitList)}
        </Typography>
        <Table
          sx={{
            size: 'xs',
          }}
        >
          <TableHead>
            <TableRow>
              <DataCell align="center" data={keyLabel(waitList)} immutable />
              <DataCell align="center" data="Rank" immutable />
              <DataCell align="center" data="Name" immutable />
              <DataCell align="center" data="Points" immutable />
              <DataCell align="center" data="Avp #" immutable />
              <DataCell align="center" data="Name" immutable />
              <DataCell align="center" data="Points" immutable />
              <DataCell align="center" data="Avp #" immutable />
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((team) => (
              <TableRow
                key={team.seed}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {team.seed}
                </TableCell>
                <DataCell align="center" data={team.rank} immutable />
                <DataCell
                  align="center"
                  data={team.p1Name}
                  activeEdit={activeEdit}
                />
                <DataCell
                  align="center"
                  data={team.p1Rank}
                  activeEdit={activeEdit}
                />
                <DataCell
                  align="center"
                  data={team.p1Avpa}
                  activeEdit={activeEdit}
                />
                <DataCell
                  align="center"
                  data={team.p2Name}
                  activeEdit={activeEdit}
                />
                <DataCell
                  align="center"
                  data={team.p2Rank}
                  activeEdit={activeEdit}
                />
                <DataCell
                  align="center"
                  data={team.p2Avpa}
                  activeEdit={activeEdit}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return null;
};

DivEntries.propTypes = {
  division: PropTypes.string.isRequired,
  waitList: PropTypes.bool.isRequired,
};

export default DivEntries;
