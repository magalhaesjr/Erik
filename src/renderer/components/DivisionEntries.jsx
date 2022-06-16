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
import { Button, Typography, styled } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { hasProp } from '../../domain/validate';
import DataCell from './table/DataCell';
import TableAction from './table/TableAction';

// Style the inline buttons
const InlineButton = styled(Button)(({ theme }) => ({
  fontSize: 'small',
  paddingLeft: '0px',
  paddingTop: '0px',
  paddingRight: '0px',
  paddingBottom: '0px',
  margins: '0px',
  minWidth: '0px',
}));

// Adds team entries to the division state
const addTeams = (division, teams, waitList) => {
  if (waitList) {
    division.waitList.forEach((team) => {
      teams.push(team);
    });
  } else {
    division.teams.forEach((team) => {
      teams.push(team);
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

// Division entries table
const DivEntries = (props) => {
  const { division, waitList } = props;

  // Grabs selector from redux
  const entries = useSelector((state) => {
    let teams = [];
    // eslint-disable-next-line prettier/prettier
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day], 'divisions')) {
        if (hasProp(state[day].divisions, division)) {
          teams = addTeams(state[day].divisions[division], teams, waitList);
        }
      }
    });
    return teams;
  });

  // Dispatching
  const dispatch = useDispatch();

  // State
  const [activeEdit, setEdit] = React.useState(false);
  // Handlers
  const handleEdit = (i) => {
    setEdit(!activeEdit);
  };

  const changeWaitStatus = (e, i) => {
    // Add the team to the opposite list
    dispatch({
      type: 'changeWaitStatus',
      payload: {
        waitList,
        division,
        team: i,
      },
    });
  };

  const handleChange = (e, i, player) => {
    const { name, value } = e.target;
    // Copy player info
    const newTeam = JSON.parse(JSON.stringify(entries[i]));
    // Split player name back
    newTeam.players[player][name] = value;
    // dispatch a change to player info
    dispatch({
      type: 'updatePlayer',
      payload: {
        waitList,
        division,
        team: i,
        playerNum: player,
        player: newTeam.players[player],
      },
    });
  };

  const handleSave = (i) => {
    setEdit(!activeEdit);
    // Send all entries to dispatch
    dispatch({
      type: 'updateDivision',
      payload: {
        waitList,
        division,
        teams: entries,
      },
    });
  };

  const handleAdd = (i) => {
    setEdit(true);
    // Create a new team
    dispatch({
      type: 'addTeam',
      payload: {
        waitList,
        division,
        team: null,
      },
    });
  };

  const handleDelete = (e, i) => {
    dispatch({
      type: 'removeTeam',
      payload: {
        waitList,
        division,
        team: i,
      },
    });
  };

  const genPools = () => {
    if (entries.length > 0) {
      dispatch({
        type: 'generatePools',
        payload: {
          division,
        },
      });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" align="left">
        {label(waitList)}
      </Typography>
      <TableAction
        activeEdit={activeEdit}
        onEdit={handleEdit}
        onAdd={handleAdd}
        onSave={handleSave}
        onGenPools={genPools}
        waitList={waitList}
      />
      <Table
        sx={{
          size: 'xs',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" padding="none" margins="0px" />
            <TableCell align="left" padding="none" margins="0px" />
            <DataCell align="center" data={keyLabel(waitList)} immutable />
            <DataCell align="center" data="Rank" immutable />
            <DataCell align="center" data="First" immutable />
            <DataCell align="center" data="Last" immutable />
            <DataCell align="center" data="Points" immutable />
            <DataCell align="center" data="Avp #" immutable />
            <DataCell align="center" data="First" immutable />
            <DataCell align="center" data="Last" immutable />
            <DataCell align="center" data="Points" immutable />
            <DataCell align="center" data="Avp #" immutable />
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((team, index) => (
            <TableRow
              key={team.seed}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left" padding="none" margins="0px">
                <InlineButton
                  onClick={(e) => {
                    handleDelete(e, index);
                  }}
                >
                  <DeleteOutlineIcon />
                </InlineButton>
              </TableCell>
              <TableCell
                align="left"
                fontSize="small"
                padding="none"
                margins="0px"
              >
                <InlineButton
                  onClick={(e) => {
                    changeWaitStatus(e, index);
                  }}
                >
                  {waitList ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </InlineButton>
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {team.seed}
              </TableCell>
              <DataCell align="center" data={team.ranking} immutable />
              <DataCell
                align="center"
                data={team.players[0].firstName}
                name="firstName"
                activeEdit={activeEdit}
                onChange={(e) => {
                  handleChange(e, index, 0);
                }}
              />
              <DataCell
                align="center"
                data={team.players[0].lastName}
                name="lastName"
                activeEdit={activeEdit}
                onChange={(e) => {
                  handleChange(e, index, 0);
                }}
              />
              <DataCell
                align="center"
                data={team.players[0].ranking}
                name="ranking"
                activeEdit={activeEdit}
                onChange={(e) => {
                  handleChange(e, index, 0);
                }}
              />
              <DataCell
                align="center"
                data={team.players[0].avpa}
                name="avpa"
                activeEdit={activeEdit}
                onChange={(e) => {
                  handleChange(e, index, 0);
                }}
              />
              <DataCell
                align="center"
                data={team.players[1].firstName}
                name="firstName"
                activeEdit={activeEdit}
                onChange={(e) => {
                  handleChange(e, index, 1);
                }}
              />
              <DataCell
                align="center"
                data={team.players[1].lastName}
                name="lastName"
                activeEdit={activeEdit}
                onChange={(e) => {
                  handleChange(e, index, 1);
                }}
              />
              <DataCell
                align="center"
                data={team.players[1].ranking}
                name="ranking"
                activeEdit={activeEdit}
                onChange={(e) => {
                  handleChange(e, index, 1);
                }}
              />
              <DataCell
                align="center"
                data={team.players[1].avpa}
                name="avpa"
                activeEdit={activeEdit}
                onChange={(e) => {
                  handleChange(e, index, 1);
                }}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DivEntries.propTypes = {
  division: PropTypes.string.isRequired,
  waitList: PropTypes.bool.isRequired,
};

export default DivEntries;
