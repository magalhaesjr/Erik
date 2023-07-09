/**
 * Creates a dialog window for Filling in info for a team entry
 */
import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createName, createPlayer } from '../../domain/player';
import { TeamEntry, selectDivisions, updateEntries } from '../redux/entries';
import {
  getDivisionKey,
  getDivisionName,
  getTeamKey,
} from '../../domain/utility';

/** Types */
export type EntryDialogProps = {
  open: boolean;
  onClose: () => void;
  waitList: boolean;
  entry?: TeamEntry;
  division?: string;
};

type EntryValidity = {
  valid: boolean;
  msg: string;
};

/** Static Callbacks */
const validateName = (name: string): EntryValidity => {
  if (name.length === 0) {
    return {
      valid: false,
      msg: 'Name can not be empty',
    };
  }
  return {
    valid: true,
    msg: '',
  };
};

const validateRanking = (rankString: string): EntryValidity => {
  if (rankString.length === 0) {
    return {
      valid: false,
      msg: 'Ranking must be a number',
    };
  }
  const ranking = Number(rankString);

  if (Number.isNaN(ranking)) {
    return {
      valid: false,
      msg: 'Ranking must be a number',
    };
  }

  if (ranking < 0) {
    return {
      valid: false,
      msg: 'Ranking points must be >= 0',
    };
  }

  return {
    valid: true,
    msg: '',
  };
};

/** Component */
const EntryDialog = ({
  open,
  onClose,
  division,
  entry,
  waitList,
}: EntryDialogProps) => {
  /** Definitions */
  const dispatch = useAppDispatch();

  /** Redux related state */
  const divisions = useAppSelector(selectDivisions, isEqual);

  /** State */
  const [entryDivision, setDivision] = useState<string>(() => {
    if (entry) {
      return getDivisionKey(entry.division);
    }

    if (division) {
      return getDivisionKey(division);
    }

    return '';
  });

  // Player 1 first
  const [p1First, setP1First] = useState<string>(
    entry && entry.players.length > 0 ? entry.players[0].name.first : ''
  );
  const [p1FirstValidity, setP1FirstValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
  // Player 1 Last
  const [p1Last, setP1Last] = useState<string>(
    entry && entry.players.length > 0 ? entry.players[0].name.last : ''
  );
  const [p1LastValidity, setP1LastValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
  // Player 1 Ranking
  const [p1Ranking, setP1Ranking] = useState<string>(
    entry ? `${entry.ranking}` : '0'
  );
  const [p1RankingValidity, setP1RankingValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });

  // Player 2 first
  const [p2First, setP2First] = useState<string>(
    entry && entry.players.length > 1 ? entry.players[1].name.first : ''
  );
  const [p2FirstValidity, setP2FirstValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
  // Player 2 Last
  const [p2Last, setP2Last] = useState<string>(
    entry && entry.players.length > 1 ? entry.players[1].name.last : ''
  );
  const [p2LastValidity, setP2LastValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
  // Player 2 Ranking
  const [p2Ranking, setP2Ranking] = useState<string>(
    entry ? `${entry.ranking}` : '0'
  );
  const [p2RankingValidity, setP2RankingValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });

  /** Callbacks */
  const changeDivision = useCallback(
    (event) => {
      setDivision(event.target.value);
    },
    [setDivision]
  );

  const handleP1First = useCallback(
    (event) => {
      const newName = event.target.value;
      setP1First(newName);
      // Update validity
      setP1FirstValidity(validateName(newName));
    },
    [setP1First, setP1FirstValidity]
  );
  const handleP1Last = useCallback(
    (event) => {
      const newName = event.target.value;
      setP1Last(newName);
      // Update validity
      setP1LastValidity(validateName(newName));
    },
    [setP1Last, setP1LastValidity]
  );
  const handleP1Ranking = useCallback(
    (event) => {
      const newRank = event.target.value;
      setP1Ranking(newRank);
      // Update validity
      setP1RankingValidity(validateRanking(newRank));
    },
    [setP1Ranking, setP1RankingValidity]
  );

  const handleP2First = useCallback(
    (event) => {
      const newName = event.target.value;
      setP2First(newName);
      // Update validity
      setP2FirstValidity(validateName(newName));
    },
    [setP2First, setP2FirstValidity]
  );
  const handleP2Last = useCallback(
    (event) => {
      const newName = event.target.value;
      setP2Last(newName);
      // Update validity
      setP2LastValidity(validateName(newName));
    },
    [setP2Last, setP2LastValidity]
  );
  const handleP2Ranking = useCallback(
    (event) => {
      const newRank = event.target.value;
      setP2Ranking(newRank);
      // Update validity
      setP2RankingValidity(validateRanking(newRank));
    },
    [setP2Ranking, setP2RankingValidity]
  );

  const closeDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSubmit = useCallback(() => {
    if (entry) {
      const updatedEntry = {
        ...cloneDeep(entry),
        division: getDivisionName(entryDivision),
      };

      const player1 =
        updatedEntry.players.length > 0
          ? {
              ...cloneDeep(updatedEntry.players[0]),
              name: createName(p1First, p1Last),
              ranking: Number(p1Ranking),
            }
          : createPlayer(p1First, p1Last, Number(p1Ranking));
      const player2 =
        updatedEntry.players.length > 1
          ? {
              ...cloneDeep(updatedEntry.players[1]),
              name: createName(p2First, p2Last),
              ranking: Number(p2Ranking),
            }
          : createPlayer(p2First, p2Last, Number(p2Ranking));

      updatedEntry.players = [player1, player2];
      updatedEntry.ranking = player1.ranking + player2.ranking;

      dispatch(
        updateEntries('modify', updatedEntry, {
          id: getTeamKey(entry),
        })
      );
    } else {
      const player1 = createPlayer(p1First, p1Last, Number(p1Ranking));
      const player2 = createPlayer(p2First, p2Last, Number(p2Ranking));
      dispatch(
        updateEntries('add', {
          ranking: player1.ranking + player2.ranking,
          division: getDivisionName(entryDivision),
          players: [player1, player2],
          registrationTime: 0,
          isWaitlisted: waitList,
          paid: false,
        })
      );
    }

    closeDialog();
  }, [
    closeDialog,
    dispatch,
    entryDivision,
    p1First,
    p1Last,
    p1Ranking,
    p2First,
    p2Last,
    p2Ranking,
    entry,
    waitList,
  ]);

  /** Effects */
  useEffect(() => {
    if (entry) {
      setDivision(getDivisionKey(entry.division));
      const p1 = entry.players[0];
      setP1First(p1.name.first);
      setP1Last(p1.name.last);
      setP1Ranking(`${entry.players[0].ranking}`);
      // Update validity
      setP1FirstValidity(validateName(p1.name.first));
      setP1LastValidity(validateName(p1.name.last));
      setP1RankingValidity(validateRanking(`${p1.ranking}`));

      if (entry.players.length > 1) {
        const p2 = entry.players[1];
        setP2First(p2.name.first);
        setP2Last(p2.name.last);
        setP2Ranking(`${p2.ranking}`);
        // Update validity
        setP2FirstValidity(validateName(p2.name.first));
        setP2LastValidity(validateName(p2.name.last));
        setP2RankingValidity(validateRanking(`${p2.ranking}`));
      }
    } else {
      setP1First('');
      setP1Last('');
      setP1Ranking('0');
      // Update validity
      setP1FirstValidity(validateName(''));
      setP1LastValidity(validateName(''));
      setP1RankingValidity(validateRanking(`0`));
      // P2
      setP2First('');
      setP2Last('');
      setP2Ranking('0');
      // Update validity
      setP2FirstValidity(validateName(''));
      setP2LastValidity(validateName(''));
      setP2RankingValidity(validateRanking(`0`));
    }
  }, [entry]);

  return (
    <Dialog key="entry-dialog" open={open}>
      <DialogTitle key="entry-dialog/title">Edit Entry</DialogTitle>
      <DialogContent key="entry-dialog/content">
        <Grid
          container
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="center"
          alignContent="center"
        >
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Select
              id="division-select"
              value={entryDivision}
              label="Division"
              onChange={changeDivision}
            >
              {divisions.map((divName) => (
                <MenuItem key={divName} value={divName}>
                  {divName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <TextField
              key="entry-dialog/p1-first"
              data-testid="entry-dialog/p1-first"
              margin="dense"
              size="small"
              label="P1 First"
              value={p1First}
              error={!p1FirstValidity.valid}
              helperText={p1FirstValidity.msg}
              onChange={handleP1First}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              key="entry-dialog/p1-last"
              data-testid="entry-dialog/p1-last"
              margin="dense"
              size="small"
              label="P1 Last"
              value={p1Last}
              error={!p1LastValidity.valid}
              helperText={p1LastValidity.msg}
              onChange={handleP1Last}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              key="entry-dialog/p1-ranking"
              data-testid="entry-dialog/p1-ranking"
              margin="dense"
              size="small"
              label="P1 Ranking"
              value={p1Ranking}
              error={!p1RankingValidity.valid}
              helperText={p1RankingValidity.msg}
              onChange={handleP1Ranking}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              key="entry-dialog/p2-first"
              data-testid="entry-dialog/p2-first"
              margin="dense"
              size="small"
              label="P2 First"
              value={p2First}
              error={!p2FirstValidity.valid}
              helperText={p2FirstValidity.msg}
              onChange={handleP2First}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              key="entry-dialog/p2-last"
              data-testid="entry-dialog/p2-last"
              margin="dense"
              size="small"
              label="P2 Last"
              value={p2Last}
              error={!p2LastValidity.valid}
              helperText={p2LastValidity.msg}
              onChange={handleP2Last}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              key="entry-dialog/p2-ranking"
              data-testid="entry-dialog/p2-ranking"
              margin="dense"
              size="small"
              label="P2 Ranking"
              value={p2Ranking}
              error={!p2RankingValidity.valid}
              helperText={p2RankingValidity.msg}
              onChange={handleP2Ranking}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions key="entry-dialog/actions">
        <Button
          key="entry-dialog/submit"
          data-testid="entry-dialog/submit"
          disabled={
            !p1FirstValidity.valid ||
            !p1LastValidity.valid ||
            !p1RankingValidity.valid ||
            !p2FirstValidity.valid ||
            !p2LastValidity.valid ||
            !p2RankingValidity.valid ||
            entryDivision.length === 0
          }
          onClick={onSubmit}
        >
          Submit
        </Button>
        <Button
          key="entry-dialog/cancel"
          data-testid="entry-dialog/cancel"
          onClick={closeDialog}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntryDialog;
