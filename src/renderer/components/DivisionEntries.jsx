/* eslint-disable react/no-array-index-key */
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
    division.props.waitList.forEach((team) => {
      teams.push(team);
    });
  } else {
    division.props.teams.forEach((team) => {
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

  // Edit state
  const [activeEdit, setEdit] = React.useState(false);

  // Grabs selector from redux
  const { entries, poolsValid, divReady, divStatus } = useSelector((state) => {
    const out = {
      entries: [],
      poolsValid: false,
      divReady: false,
      divStatus: '',
    };
    // eslint-disable-next-line prettier/prettier
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day].divisions, division)) {
        out.entries = addTeams(
          state[day].divisions[division],
          out.entries,
          waitList
        );

        // State of pools
        if (state[day].divisions[division].props.pools.length > 0) {
          out.poolsValid = true;
          out.divReady = true;
          out.divStatus = 'Pools made';
        } else if (
          state[day].divisions[division].props.courts.length <
          state[day].divisions[division].props.minNets
        ) {
          out.divStatus = 'Not enough courts assigned';
        } else if (
          state[day].divisions[division].props.courts.length >
          state[day].divisions[division].props.maxNets
        ) {
          out.divStatus = 'Too many courts assigned';
        } else if (
          state[day].divisions[division].props.courts.length >=
            state[day].divisions[division].props.minNets &&
          state[day].divisions[division].props.courts.length <=
            state[day].divisions[division].props.maxNets
        ) {
          out.divReady = true;
          out.divStatus = 'Ready to make pools';
        }
      }
    });
    return out;
  });

  // Dispatching
  const dispatch = useDispatch();

  // Actions
  const resetPools = () => {
    if (poolsValid) {
      // Need to reset all pools because something has changed
      dispatch({
        type: 'resetPools',
        payload: {
          waitList,
          division,
        },
      });
    }
  };

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

    // Reset pools if necessary
    resetPools();
  };

  const handleChange = (e, i, player) => {
    const { name, value } = e.target;
    // Copy player info
    const newTeam = JSON.parse(JSON.stringify(entries[i]));
    switch (name) {
      case 'name': {
        // Split player name back and assign
        const { firstName, lastName } = parseName(value);
        newTeam.props.players[player].props.firstName = firstName;
        newTeam.props.players[player].props.lastName = lastName;
        // Reset pools if necessary
        resetPools();
        break;
      }
      case 'paid': {
        newTeam.props.players[player].props.paid = e.target.checked;
        break;
      }
      case 'staff': {
        newTeam.props.players[player].props.staff = e.target.checked;
        break;
      }
      case 'membership': {
        newTeam.props.players[player].props.membershipValid = e.target.checked;
        break;
      }
      default:
        newTeam.props.players[player].props[name] = e.target.value;
        // reset pools if necessary
        resetPools();
    }
    // dispatch a change to player info
    dispatch({
      type: 'updatePlayer',
      payload: {
        waitList,
        division,
        team: i,
        playerNum: player,
        player: newTeam.props.players[player],
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
    // Reset pools if necessary
    resetPools();
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
    // Reset pools if necessary
    resetPools();
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
        poolsValid={poolsValid}
        divReady={divReady}
        divStatus={divStatus}
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
              key="seedHeader"
              immutable
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Rank"
              immutable
              key="rank"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Name"
              immutable
              key="p1Name"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Points"
              key="p1Points"
              immutable
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Paid"
              immutable
              key="p1Paid"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Staff"
              immutable
              key="p1Staff"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Avpa"
              immutable
              key="p1Avpa"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Name"
              immutable
              key="p2Name"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Points"
              key="p2Points"
              immutable
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Paid"
              immutable
              key="p2Paid"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Staff"
              immutable
              key="p2Staff"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
            <DataCell
              align="center"
              data="Avpa"
              immutable
              key="p2Avpa"
              sx={{
                padding: '0px',
                fontWeight: 'bold',
              }}
            />
          </TableRow>
        </TableHead>
        <TableBody key={`${division}_Entries`}>
          {entries.map((team, index) => (
            <TableRow key={team.props.seed}>
              <TableCell
                align="left"
                padding="none"
                margins="0px"
                key={`delete_${team.props.seed}`}
              >
                <InlineButton
                  key={`delete_btn_${team.props.seed}`}
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
                key={`demote_${team.props.seed}`}
              >
                <InlineButton
                  key={`demote_btn_${team.props.seed}`}
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
                key={`team_${team.props.seed}_${team.props.ranking}`}
              >
                {team.props.seed}
              </TableCell>
              <DataCell
                align="center"
                data={team.props.ranking}
                immutable
                key={`ranking_${team.props.seed}_${team.props.ranking}`}
              />
              {team.props.players.map((player, playerInd) => (
                <React.Fragment
                  key={`team_${team.props.seed}_num_${playerInd}_playerChecks_${player.props.firstName}_${player.props.lastName}`}
                >
                  <DataCell
                    align="center"
                    data={joinName(
                      player.props.firstName,
                      player.props.lastName
                    )}
                    name="name"
                    key={`team_${team.props.seed}_name_${playerInd}`}
                    activeEdit={activeEdit}
                    onChange={(e) => {
                      handleChange(e, index, playerInd);
                    }}
                    sx={{
                      padding: '0px',
                      borderLeft: '1px solid #bbbbbb',
                    }}
                  />
                  <DataCell
                    align="center"
                    data={player.props.ranking}
                    name="ranking"
                    activeEdit={activeEdit}
                    key={`team_${team.props.seed}_rank_${playerInd}`}
                    onChange={(e) => {
                      handleChange(e, index, playerInd);
                    }}
                  />
                  <TableCell
                    align="center"
                    fontSize="small"
                    padding="none"
                    key={`team_${team.props.seed}_paid_${playerInd}`}
                    margins="0px"
                  >
                    <Checkbox
                      checked={player.props.paid && !player.props.staff}
                      disabled={player.props.staff}
                      name="paid"
                      key={`team_${team.props.seed}_paidCheck_${playerInd}`}
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
                    key={`team_${team.props.seed}_staff_${playerInd}`}
                  >
                    <Checkbox
                      checked={player.props.staff}
                      name="staff"
                      key={`team_${team.props.seed}_staffCheck_${playerInd}`}
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
                    key={`team_${team.props.seed}_avpa_${playerInd}`}
                  >
                    <Checkbox
                      checked={player.membershipValid}
                      name="membership"
                      key={`team_${team.props.seed}_avpaCheck_${playerInd}`}
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
