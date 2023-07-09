/* eslint-disable react/prop-types */
// Creates a React table for all entries into division
import { ChangeEvent, ReactInstance, forwardRef, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper, styled } from '@mui/material';
import {
  selectDivisionEntries,
  TeamEntry,
  Player,
  updateEntries,
} from '../redux/entries';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import type { RootState } from '../redux/store';

/** Types */
export type RegSheetProps = {
  division: string;
};

// Define pre-paid and unpaid values
const PREPAID = '$40';
const UNPAID = '$45';
const PREPAID_TEAM = '$80';
const WALKON = '$90';

// Styles
const RegPaper = styled(Paper)(() => ({
  fontFamily: 'Arial',
  fontSize: '8',
  margin: '0in',
  padding: '0px',
  background: '#ffffff',
}));

const RegCell = styled(TableCell)(() => ({
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

const HeadCell = styled(TableCell)(() => ({
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

// Returns paid status based on player
const paidStatus = (player: Player) => {
  if (player.staff) {
    return 'staff';
  }
  if (player.paid) {
    return PREPAID;
  }
  return UNPAID;
};

// Division entries table
const RegSheet = forwardRef<ReactInstance | null, RegSheetProps>(
  (props, ref) => {
    const { division } = props;

    /** Redux State */
    const selectEntries = useCallback(
      (state: RootState) => {
        return selectDivisionEntries(state, division);
      },
      [division]
    );

    const entries: TeamEntry[] = useAppSelector(selectEntries);

    // Grab dispatch
    const dispatch = useAppDispatch();

    // Update paid status of a player
    const handlePaid = (
      event: ChangeEvent<HTMLSelectElement>,
      entry: TeamEntry,
      playerInd: number
    ) => {
      switch (event.target.value) {
        case PREPAID: {
          entry.players[playerInd].paid = true;
          break;
        }
        case UNPAID: {
          entry.players[playerInd].paid = false;
          break;
        }
        default: {
          entry.players[playerInd].paid = false;
          entry.players[playerInd].staff = true;
        }
      }
      dispatch(updateEntries('modify', entry));
    };

    return (
      <TableContainer
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        component={RegPaper}
      >
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
              <TableRow key={`team-seed/${index + 1}`}>
                <RegCell>{index + 1}</RegCell>
                <RegCell>{team.ranking}</RegCell>
                <RegCell>
                  <select
                    value={paidStatus(team.players[0])}
                    onChange={(e) => handlePaid(e, team, 0)}
                    style={selectStyle}
                  >
                    <option value={PREPAID}>{PREPAID}</option>
                    <option value={UNPAID}>{UNPAID}</option>
                    <option value="staff">staff</option>
                  </select>
                </RegCell>
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
                <RegCell>{team.players[0].name.full}</RegCell>
                <RegCell>{team.players[0].ranking}</RegCell>
                <RegCell />
                <RegCell>
                  <select
                    value={paidStatus(team.players[1])}
                    onChange={(e) => handlePaid(e, team, 1)}
                    style={selectStyle}
                  >
                    <option value={PREPAID}>{PREPAID}</option>
                    <option value={UNPAID}>{UNPAID}</option>
                    <option value="staff">staff</option>
                  </select>
                </RegCell>
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
                <RegCell>{team.players[1].name.full}</RegCell>
                <RegCell>{team.players[1].ranking}</RegCell>
                <RegCell />
              </TableRow>
            ))}
            <TableRow />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

export default RegSheet;
