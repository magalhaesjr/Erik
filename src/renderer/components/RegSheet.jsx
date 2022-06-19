/* eslint-disable @typescript-eslint/no-unused-vars */
// Creates a React table for all entries into division
import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper, styled } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hasProp } from '../../domain/validate';

// Define pre-paid and unpaid values
const PREPAID = '$40';
const UNPAID = '$45';
const PREPAID_TEAM = '$80';
const WALKON = '$90';

// Styles
const RegPaper = styled(Paper)(({ theme }) => ({
  fontFamily: 'Arial',
  fontSize: '8',
  margin: '0in',
  padding: '0px',
  background: '#ffffff',
}));

const RegCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Calibri',
  fontSize: '11pt',
  height: '15.75pt',
  margin: '0px',
  padding: '0px',
  borderRadius: '0px',
  border: '2px solid black',
  color: '#000000',
  background: '#ffffff',
  textAlign: 'center',
  minWidth: '2.29pt',
  overflow: 'hidden',
  flexShrink: '0',
}));

const selectStyle = {
  fontFamily: 'Calibri',
  fontSize: '11pt',
  padding: 0,
  margin: 0,
  display: 'inline',
  borderStyle: 'none',
};

const HeadCell = styled(TableCell)(({ theme }) => ({
  component: 'th',
  font: 'Arial',
  fontSize: '8pt',
  fontWeight: 'bold',
  height: '15.75pt',
  margin: '0px',
  padding: '0px',
  borderRadius: '0px',
  border: '1px solid black',
  color: '#000000',
  background: '#ffffff',
  textAlign: 'center',
  minWidth: '2.29pt',
  overflow: 'hidden',
  flexShrink: '0',
}));

// Adds team entries to the division state
const addTeams = (division, teams) => {
  division.teams.forEach((team) => {
    teams.push(team);
  });
  return teams;
};

// Returns paid status based on player
const paidStatus = (player) => {
  if (player.staff) {
    return 'staff';
  }
  if (player.paid) {
    return PREPAID;
  }
  return UNPAID;
};

// Division entries table
const RegSheet = React.forwardRef((props, ref) => {
  const { division, mode } = props;

  // Grabs selector from redux
  const entries = useSelector((state) => {
    let teams = [];
    // eslint-disable-next-line prettier/prettier
    Object.keys(state).forEach((day) => {
      if (hasProp(state[day], 'divisions')) {
        if (hasProp(state[day].divisions, division)) {
          teams = addTeams(state[day].divisions[division], teams);
        }
      }
    });

    return teams;
  });

  // Grab dispatch
  const dispatch = useDispatch();

  // Update paid status of a player
  const handlePaid = (event, index, playerInd) => {
    switch (event.target.value) {
      case PREPAID: {
        dispatch({
          type: 'updatePaidStatus',
          payload: {
            division,
            team: index,
            playerInd,
            paid: true,
            staff: false,
          },
        });
        break;
      }
      case UNPAID: {
        dispatch({
          type: 'updatePaidStatus',
          payload: {
            division,
            team: index,
            playerInd,
            paid: false,
            staff: false,
          },
        });
        break;
      }
      default: {
        dispatch({
          type: 'updatePaidStatus',
          payload: {
            division,
            team: index,
            playerInd,
            paid: false,
            staff: true,
          },
        });
      }
    }
  };

  return (
    <TableContainer ref={ref} component={RegPaper}>
      <Table
        sx={{
          tableLayout: 'auto',
          overflow: 'hidden',
          width: '10.8in',
          border: '1px solid black',
        }}
      >
        <TableHead>
          <TableRow>
            <HeadCell
              colSpan={14}
              sx={{
                font: 'calibri',
                fontSize: '12pt',
                height: '22.5pt',
              }}
            >
              {' '}
              {`${division} (${PREPAID_TEAM} pre-paid / ${WALKON} walk-on)`}{' '}
            </HeadCell>
          </TableRow>
          <TableRow>
            <HeadCell
              colSpan={7}
              sx={{
                font: 'calibri',
                fontSize: '12pt',
              }}
            >
              {' '}
              Player 1
            </HeadCell>
            <HeadCell />
            <HeadCell
              colSpan={6}
              sx={{
                font: 'calibri',
                fontSize: '12pt',
              }}
            >
              {' '}
              Player 2
            </HeadCell>
          </TableRow>
          <TableRow>
            <HeadCell width="1.89%">#</HeadCell>
            <HeadCell width="5.417%">Team Ranking</HeadCell>
            <HeadCell width="3.768%">Paid</HeadCell>
            <HeadCell width="4.592%">Waiver</HeadCell>
            <HeadCell width="6.01%">ID</HeadCell>
            <HeadCell width="16.96%">Name</HeadCell>
            <HeadCell width="5.417%">Ranking</HeadCell>
            <HeadCell width="2.003%" />
            <HeadCell width="3.768%">Paid</HeadCell>
            <HeadCell width="4.592%">Waiver</HeadCell>
            <HeadCell width="6.01%">ID</HeadCell>
            <HeadCell width="16.96%">Name</HeadCell>
            <HeadCell width="5.417%">Ranking</HeadCell>
            <HeadCell width="17.198%">Comments</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            minWidth: '2.29pt',
          }}
        >
          {entries.map((team, index) => (
            <TableRow key={team.seed}>
              <RegCell>{team.seed}</RegCell>
              <RegCell>{team.ranking}</RegCell>
              {mode === 'form' ? (
                <RegCell>
                  <select
                    value={paidStatus(team.players[0])}
                    onChange={(e) => handlePaid(e, index, 0)}
                    style={selectStyle}
                  >
                    <option value={PREPAID}>{PREPAID}</option>
                    <option value={UNPAID}>{UNPAID}</option>
                    <option value="staff">staff</option>
                  </select>
                </RegCell>
              ) : (
                <RegCell>{paidStatus(team.players[0])}</RegCell>
              )}
              <RegCell />
              {team.players[0].membershipValid ? (
                <RegCell>Valid</RegCell>
              ) : (
                <RegCell
                  sx={{
                    color: 'red',
                  }}
                >
                  exp
                </RegCell>
              )}
              <RegCell>
                {team.players[0].firstName.concat(
                  ' ',
                  team.players[0].lastName
                )}
              </RegCell>
              <RegCell>{team.players[0].ranking}</RegCell>
              <RegCell />
              {mode === 'form' ? (
                <RegCell>
                  <select
                    value={paidStatus(team.players[1])}
                    onChange={(e) => handlePaid(e, index, 1)}
                    style={selectStyle}
                  >
                    <option value={PREPAID}>{PREPAID}</option>
                    <option value={UNPAID}>{UNPAID}</option>
                    <option value="staff">staff</option>
                  </select>
                </RegCell>
              ) : (
                <RegCell>{paidStatus(team.players[1])}</RegCell>
              )}
              <RegCell />
              {team.players[1].membershipValid ? (
                <RegCell>Valid</RegCell>
              ) : (
                <RegCell
                  sx={{
                    color: 'red',
                  }}
                >
                  exp
                </RegCell>
              )}
              <RegCell>
                {team.players[1].firstName.concat(
                  ' ',
                  team.players[1].lastName
                )}
              </RegCell>
              <RegCell>{team.players[1].ranking}</RegCell>
              <RegCell />
            </TableRow>
          ))}
          <TableRow />
        </TableBody>
      </Table>
    </TableContainer>
  );
});

RegSheet.propTypes = {
  division: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
};

export default RegSheet;
