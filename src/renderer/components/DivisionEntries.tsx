/* eslint-disable react/no-array-index-key */
// Creates a React table for all entries into division
import { useCallback, useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Checkbox, Typography, styled } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  TeamEntry,
  selectDivisionEntries,
  updateEntries,
  entryActions,
  EntryActions,
} from '../redux/entries';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import type { RootState } from '../redux/store';
import {
  generatePools,
  resetPools as poolReset,
  changeWaitStatus as reduxWaitChange,
} from '../redux/tournament';
import DataCell from './table/DataCell';
import TableAction from './table/TableAction';
import EntryDialog from './EntryDialog';

/** Types */
export type DivEntriesProps = {
  division: string;
  waitList: boolean;
};

type DivisionStatus = {
  valid: boolean;
  msg: '';
};

/** Static callbacks */
// Style the inline buttons
const InlineButton = styled(Button)(() => ({
  fontSize: 'small',
  paddingLeft: '0px',
  paddingTop: '0px',
  paddingRight: '0px',
  paddingBottom: '0px',
  margins: '0px',
  minWidth: '0px',
}));

// Specifies the label for the table
const label = (waitList: boolean) => {
  return waitList ? 'Wait List' : 'Entries';
};

// Specifies the label for the header column
const keyLabel = (waitList: boolean) => {
  return waitList ? 'Position' : 'Seed';
};

// Division entries table
const DivEntries = ({ division, waitList }: DivEntriesProps) => {
  /** Definitions */
  const dispatch = useAppDispatch();

  /** Redux State */
  const selectEntries = useCallback(
    (state: RootState) => selectDivisionEntries(state, division),
    [division]
  );
  const entries = useAppSelector(selectEntries);

  /** State */
  const [poolsValid, setPoolsValid] = useState<boolean>(false);
  const [divStatus, setDivStatus] = useState<DivisionStatus>({
    valid: false,
    msg: '',
  });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const entryRef = useRef<TeamEntry>();

  /** Callbacks */
  const editEntry = useCallback(
    (entry?: TeamEntry) => () => {
      entryRef.current = entry;
      setDialogOpen(true);
    },
    [setDialogOpen]
  );

  const closeDialog = useCallback(() => {
    entryRef.current = undefined;
    setDialogOpen(false);
  }, [setDialogOpen]);

  // Actions
  const resetPools = () => {
    if (poolsValid) {
      // Need to reset all pools because something has changed
      dispatch(poolReset({ waitList, division }));
    }
  };

  const changeWaitStatus = useCallback(
    (entry: TeamEntry) => () => {
      dispatch(
        updateEntries(entryActions.changeWaitlist as EntryActions, entry, {
          isWaitListed: !waitList,
        })
      );
    },
    [dispatch, waitList]
  );

  const handleDelete = useCallback(
    (entry: TeamEntry) => () => {
      dispatch(updateEntries(entryActions.remove as EntryActions, entry));
    },
    [dispatch]
  );

  /*
  const genPools = () => {
    if (entries.length > 0) {
      dispatch(generatePools({ division }));
    }
  };
  */
  const genPools = () => {};

  return (
    <>
      <TableContainer component={Paper}>
        <Typography variant="h6" align="left">
          {label(waitList)}
        </Typography>
        <TableAction
          onAdd={editEntry()}
          onGenPools={genPools}
          waitList={waitList}
          poolsValid={poolsValid}
          divReady={divStatus.valid}
          divStatus={divStatus.msg}
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
                key="delHeader"
                sx={{
                  margin: 0,
                }}
              />
              <TableCell
                align="left"
                padding="none"
                sx={{
                  margin: 0,
                }}
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
              <TableRow key={`seed-${index + 1}`}>
                <TableCell
                  align="left"
                  padding="none"
                  sx={{
                    margin: 0,
                  }}
                  key={`delete_${index + 1}`}
                >
                  <InlineButton
                    key={`delete_btn_${index + 1}`}
                    onClick={handleDelete(team)}
                  >
                    <DeleteOutlineIcon />
                  </InlineButton>
                </TableCell>
                <TableCell
                  align="left"
                  padding="none"
                  sx={{
                    margin: 0,
                  }}
                  key={`edit_${index + 1}`}
                >
                  <InlineButton
                    key={`edit-btn-${index + 1}`}
                    onClick={editEntry(team)}
                  >
                    <CreateIcon />
                  </InlineButton>
                </TableCell>
                <TableCell
                  align="left"
                  size="small"
                  padding="none"
                  sx={{
                    margin: 0,
                  }}
                  key={`demote_${index + 1}`}
                >
                  <InlineButton
                    key={`demote_btn_${index + 1}`}
                    onClick={changeWaitStatus(team)}
                  >
                    {waitList ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </InlineButton>
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  key={`team_${index + 1}_${team.ranking}`}
                >
                  {index + 1}
                </TableCell>
                <DataCell
                  align="center"
                  data={team.ranking}
                  immutable
                  key={`ranking_${index + 1}_${team.ranking}`}
                />
                {team.players.map((player, playerInd) => (
                  <Box
                    key={`team_${index + 1}_num_${playerInd}_playerChecks_${
                      player.name.full
                    }`}
                  >
                    <DataCell
                      align="center"
                      data={player.name.full}
                      immutable
                      name="name"
                      key={`team_${index + 1}_name_${player.name.full}`}
                      sx={{
                        padding: '0px',
                        borderLeft: '1px solid #bbbbbb',
                      }}
                    />
                    <DataCell
                      align="center"
                      data={player.ranking}
                      name="ranking"
                      key={`team_${index + 1}_rank_${playerInd}`}
                    />
                    <TableCell
                      align="center"
                      size="small"
                      padding="none"
                      key={`team_${index + 1}_paid_${playerInd}`}
                      sx={{
                        margin: 0,
                      }}
                    >
                      <Checkbox
                        checked={player.paid && !player.staff}
                        disabled={player.staff}
                        name="paid"
                        key={`team_${index + 1}_paidCheck_${playerInd}`}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      size="small"
                      padding="none"
                      sx={{
                        margin: 0,
                      }}
                      key={`team_${index + 1}_staff_${playerInd}`}
                    >
                      <Checkbox
                        checked={player.staff}
                        name="staff"
                        key={`team_${index + 1}_staffCheck_${playerInd}`}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      size="small"
                      padding="none"
                      sx={{
                        margin: 0,
                      }}
                      key={`team_${index + 1}_avpa_${playerInd}`}
                    >
                      <Checkbox
                        checked={player.membershipValid}
                        name="membership"
                        key={`team_${index + 1}_avpaCheck_${playerInd}`}
                      />
                    </TableCell>
                  </Box>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EntryDialog
        open={dialogOpen}
        onClose={closeDialog}
        entry={entryRef.current}
        waitList={waitList}
      />
    </>
  );
};

export default DivEntries;
