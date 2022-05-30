// Creates a React table for all entries into division
import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Paper, Typography, styled } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

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
  textOverflow: 'ellipsis',
}));

const HeadCell = styled(TableCell)(({ theme }) => ({
  component: 'th',
  font: 'Arial',
  fontSize: '8pt',
  fontWeight: 'bold',
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
  textOverflow: 'ellipsis',
}));

// Adds team entries to the division state
const addTeams = (division, teams) => {
  division.teams.forEach((team) => {
    teams.push(team);
  });
  console.log(teams);
  return teams;
};

// Specifies the label for the table
const label = (waitList) => {
  if (waitList) {
    return 'Wait List';
  }
  return 'Entries';
};

/*
// Specifies the label for the header column
const keyLabel = (waitList) => {
  if (waitList) {
    return 'Position';
  }
  return 'Seed';
};
*/
/*
            <HeadCell width="2.29pt">#</HeadCell>
            <HeadCell width="6.57pt">Team Ranking</HeadCell>
            <HeadCell width="4.57pt">Paid</HeadCell>
            <HeadCell width="5.57pt">Waiver</HeadCell>
            <HeadCell width="7.29pt">ID</HeadCell>
            <HeadCell width="20.57pt">Name</HeadCell>
            <HeadCell width="6.57pt">Ranking</HeadCell>
            <HeadCell width="2.43pt" />
            <HeadCell width="4.57pt">Paid</HeadCell>
            <HeadCell width="5.57pt">Waiver</HeadCell>
            <HeadCell width="7.29pt">ID</HeadCell>
            <HeadCell width="20.57pt">Name</HeadCell>
            <HeadCell width="6.57pt">Ranking</HeadCell>
            <HeadCell width="20.86pt">Comments</HeadCell>
  */

// Division entries table
const PoolSheet = React.forwardRef((props, ref) => {
  const { division } = props;

  // Grabs selector from redux
  const entries = useSelector((state) => {
    let teams = [];
    // eslint-disable-next-line prettier/prettier
    Object.keys(state).forEach((day) => {
      if (
        Object.prototype.hasOwnProperty.call(state[day].divisions, division)
      ) {
        teams = addTeams(state[day].divisions[division], teams);
      }
    });
    return teams;
  });
  return (
    <TableContainer ref={ref} component={RegPaper}>
      <Table
        sx={{
          width: '11in',
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
              }}
            >
              {' '}
              {division}{' '}
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
            <HeadCell width="1in">#</HeadCell>
            <HeadCell
              width="1in"
              sx={{
                overflow: 'auto',
              }}
            >
              Team Ranking
            </HeadCell>
            <HeadCell width="1in">Paid</HeadCell>
            <HeadCell width="1in">Waiver</HeadCell>
            <HeadCell width="1in">ID</HeadCell>
            <HeadCell width="1in">Name</HeadCell>
            <HeadCell width="1in">Ranking</HeadCell>
            <HeadCell width="1in" />
            <HeadCell width="1in">Paid</HeadCell>
            <HeadCell width="1in">Waiver</HeadCell>
            <HeadCell width="1in">ID</HeadCell>
            <HeadCell width="1in">Name</HeadCell>
            <HeadCell width="1in">Ranking</HeadCell>
            <HeadCell width="1in">Comments</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((team, index) => (
            <TableRow
              key={team.seed}
              sx={{
                '&:last-child td, &:last-child th': {
                  border: 0,
                  height: '15.75pt',
                  width: '11in',
                },
              }}
            >
              <RegCell>{team.seed}</RegCell>
              <RegCell>{team.ranking}</RegCell>
              {team.paid ? (
                <RegCell>$30</RegCell>
              ) : (
                <RegCell
                  sx={{
                    color: 'red',
                  }}
                >
                  $35
                </RegCell>
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
              {team.paid ? (
                <RegCell>$30</RegCell>
              ) : (
                <RegCell
                  sx={{
                    color: 'red',
                  }}
                >
                  $35
                </RegCell>
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

PoolSheet.propTypes = {
  division: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  pool: PropTypes.number.isRequired,
};

export default PoolSheet;
