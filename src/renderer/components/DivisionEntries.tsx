/* eslint-disable react/no-array-index-key */
// Creates a React table for all entries into division
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Checkbox, Typography, styled } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import {
  TeamEntry,
  selectDivisionEntries,
  updateEntries,
  selectDivisionWaitlist,
} from '../redux/entries';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import type { RootState } from '../redux/store';
import DataCell from './table/DataCell';
import TableAction from './table/TableAction';
import EntryDialog from './EntryDialog';
import { getTeamKey } from '../../domain/utility';
import { selectDivisionPools, updatePools } from '../redux/pools';
import { selectDivisionCourts } from '../redux/courts';
import { Court } from '../../domain/court';
import { RequiredCourts, selectRequiredCourts } from '../redux/rules';

/** Types */
export type DivEntriesProps = {
  division: string;
  waitList: boolean;
};

type DivisionStatus = {
  valid: boolean;
  msg: string;
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
    (state: RootState) => {
      if (waitList) {
        return selectDivisionWaitlist(state, division);
      }

      return selectDivisionEntries(state, division);
    },
    [division, waitList]
  );
  const selectPoolsValid = useCallback(
    (state: RootState) => {
      const pools = selectDivisionPools(state, division);
      return pools.length > 0;
    },
    [division]
  );
  const selectCourts = useCallback(
    (state: RootState) => selectDivisionCourts(state, division),
    [division]
  );
  const selectRequired = useCallback(
    (state: RootState) => selectRequiredCourts(state, division),
    [division]
  );

  const entries: TeamEntry[] = useAppSelector(selectEntries);
  const courts: Court[] = useAppSelector(selectCourts);
  const required: RequiredCourts = useAppSelector(selectRequired, isEqual);
  const poolsValid: boolean = useAppSelector(selectPoolsValid);

  /** State */
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
  const changeWaitStatus = useCallback(
    (entry: TeamEntry) => () => {
      dispatch(
        updateEntries('changeWaitlist', entry, {
          isWaitlisted: !waitList,
        })
      );
    },
    [dispatch, waitList]
  );

  const handleDelete = useCallback(
    (entry: TeamEntry) => () => {
      dispatch(updateEntries('remove', entry));
    },
    [dispatch]
  );

  const handlePlayerChange = useCallback(
    (entry: TeamEntry, index: number, props: { [key: string]: boolean }) =>
      () => {
        if (index <= entry.players.length) {
          const newEntry = cloneDeep(entry);
          newEntry.players[index] = {
            ...cloneDeep(newEntry.players[index]),
            ...props,
          };
          dispatch(
            updateEntries('modify', newEntry, { id: getTeamKey(newEntry) })
          );
        }
      },
    [dispatch]
  );

  const genPools = useCallback(() => {
    dispatch(updatePools('generatePools', { division }));
  }, [dispatch, division]);

  /** Effects */
  useEffect(() => {
    if (required.minNets === 0) {
      setDivStatus({ valid: false, msg: '' });
    } else if (courts.length < required.minNets) {
      setDivStatus({ valid: false, msg: 'Not enough courts' });
    } else if (courts.length > required.maxNets) {
      setDivStatus({ valid: false, msg: 'Too many courts' });
    } else {
      setDivStatus({ valid: true, msg: '' });
    }
  }, [setDivStatus, courts, required]);

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
                key="editHeader"
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
                  <Fragment
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
                        checked={(player.paid || false) && !player.staff}
                        disabled={player.staff}
                        onChange={handlePlayerChange(team, playerInd, {
                          paid: !player.paid,
                        })}
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
                        checked={player.staff || false}
                        name="staff"
                        onChange={handlePlayerChange(team, playerInd, {
                          staff: !player.staff,
                        })}
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
                        checked={player.membershipValid || false}
                        name="membership"
                        onChange={handlePlayerChange(team, playerInd, {
                          membershipValid: !player.membershipValid,
                        })}
                        key={`team_${index + 1}_avpaCheck_${playerInd}`}
                      />
                    </TableCell>
                  </Fragment>
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
        division={division}
        waitList={waitList}
      />
    </>
  );
};

export default DivEntries;
