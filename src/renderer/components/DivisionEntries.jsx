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
import { Button, Checkbox, Typography, styled } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { hasProp } from '../../domain/validate';
import { parseName, joinName } from '../../domain/player';
import DataCell from './table/DataCell';
import TableAction from './table/TableAction';

// Style the inline buttons
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const handleEdit = () => {
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
    switch (name) {
      case 'name': {
        // Split player name back and assign
        const { firstName, lastName } = parseName(value);
        newTeam.players[player].firstName = firstName;
        newTeam.players[player].lastName = lastName;
        break;
      }
      case 'paid': {
        newTeam.players[player].paid = e.target.checked;
        break;
      }
      case 'staff': {
        newTeam.players[player].staff = e.target.checked;
        break;
      }
      case 'membership': {
        newTeam.players[player].membershipValid = e.target.checked;
        break;
      }
      default:
        // eslint-disable-next-line no-console
        console.error('Could not determine target type');
    }
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

  const handleSave = () => {
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

  const handleAdd = () => {
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
        <TableHead key="divisionHeader">
          <TableRow key="header">
            <TableCell
              align="left"
              padding="none"
              margins="0px"
              key="delHeader"
            />
            <TableCell
              align="left"
              padding="none"
              margins="0px"
              key="promoteHeader"
            />
            <DataCell
              align="center"
              data={keyLabel(waitList)}
              fontWeight="bold"
              key="seedHeader"
              immutable
            />
            <DataCell
              align="center"
              data="Rank"
              fontWeight="bold"
              immutable
              key="rank"
            />
            <DataCell
              align="center"
              data="Name"
              fontWeight="bold"
              immutable
              key="p1Name"
            />
            <DataCell
              align="center"
              data="Points"
              fontWeight="bold"
              key="p1Points"
              immutable
            />
            <DataCell
              align="center"
              data="Paid"
              fontWeight="bold"
              immutable
              key="p1Paid"
            />
            <DataCell
              align="center"
              data="Staff"
              fontWeight="bold"
              immutable
              key="p1Staff"
            />
            <DataCell
              align="center"
              data="Avpa"
              fontWeight="bold"
              immutable
              key="p1Avpa"
            />
            <DataCell
              align="center"
              data="Name"
              fontWeight="bold"
              immutable
              key="p2Name"
            />
            <DataCell
              align="center"
              data="Points"
              fontWeight="bold"
              key="p2Points"
              immutable
            />
            <DataCell
              align="center"
              data="Paid"
              fontWeight="bold"
              immutable
              key="p2Paid"
            />
            <DataCell
              align="center"
              data="Staff"
              fontWeight="bold"
              immutable
              key="p2Staff"
            />
            <DataCell
              align="center"
              data="Avpa"
              fontWeight="bold"
              immutable
              key="p2Avpa"
            />
          </TableRow>
        </TableHead>
        <TableBody key="divisionEntries">
          {entries.map((team, index) => (
            <TableRow key={team.seed}>
              <TableCell
                align="left"
                padding="none"
                margins="0px"
                key={`delete_${team.seed}`}
              >
                <InlineButton
                  key={`delete_btn_${team.seed}`}
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
                key={`demote_${team.seed}`}
              >
                <InlineButton
                  key={`demote_btn_${team.seed}`}
                  onClick={(e) => {
                    changeWaitStatus(e, index);
                  }}
                >
                  {waitList ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </InlineButton>
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                align="center"
                key={`team_${team.seed}`}
              >
                {team.seed}
              </TableCell>
              <DataCell
                align="center"
                data={team.ranking}
                immutable
                key={`ranking_${team.seed}`}
              />
              {team.players.map((player, playerInd) => (
                <React.Fragment
                  // eslint-disable-next-line react/no-array-index-key
                  key={`team_${team.seed}_playerChecks_${playerInd}_${player.lastName}`}
                >
                  <DataCell
                    align="center"
                    data={joinName(player.firstName, player.lastName)}
                    name="name"
                    key={`team_${team.seed}_name_${player.firstName}_${player.lastName}`}
                    activeEdit={activeEdit}
                    onChange={(e) => {
                      handleChange(e, index, playerInd);
                    }}
                  />
                  <DataCell
                    align="center"
                    data={player.ranking}
                    name="ranking"
                    activeEdit={activeEdit}
                    key={`team_${team.seed}_rank_${player.firstName}_${player.lastName}`}
                    onChange={(e) => {
                      handleChange(e, index, playerInd);
                    }}
                  />
                  <TableCell
                    align="center"
                    fontSize="small"
                    padding="none"
                    key={`team_${team.seed}_paid_${player.firstName}_${player.lastName}`}
                    margins="0px"
                  >
                    <Checkbox
                      checked={player.paid && !player.staff}
                      disabled={player.staff}
                      name="paid"
                      key={`team_${team.seed}_paidCheck_${player.firstName}_${player.lastName}`}
                      onChange={(e) => {
                        handleChange(e, index, playerInd);
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    fontSize="small"
                    padding="none"
                    margins="0px"
                    key={`team_${team.seed}_staff_${player.firstName}_${player.lastName}`}
                  >
                    <Checkbox
                      checked={player.staff}
                      name="staff"
                      key={`team_${team.seed}_staffCheck_${player.firstName}_${player.lastName}`}
                      onChange={(e) => {
                        handleChange(e, index, playerInd);
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    fontSize="small"
                    padding="none"
                    margins="0px"
                    key={`team_${team.seed}_avpa_${player.firstName}_${player.lastName}`}
                  >
                    <Checkbox
                      checked={player.membershipValid}
                      name="membership"
                      key={`team_${team.seed}_avpaCheck_${player.firstName}_${player.lastName}`}
                      onChange={(e) => {
                        handleChange(e, index, playerInd);
                      }}
                    />
                  </TableCell>
                </React.Fragment>
              ))}
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
