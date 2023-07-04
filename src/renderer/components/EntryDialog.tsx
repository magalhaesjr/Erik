/**
 * Creates a dialog window for Filling in info for a team entry
 */
import { useCallback, useState } from 'react';
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
import { createPlayer } from '../../domain/player';
import {
  Player,
  TeamEntry,
  selectDivisions,
  updateEntries,
} from '../redux/entries';

/** Types */
export type EntryDialogProps = {
  open: boolean;
  onClose: () => void;
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

const validateRanking = (ranking: number): EntryValidity => {
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
const EntryDialog = ({ open, onClose, division, entry }: EntryDialogProps) => {
  /** Definitions */
  const dispatch = useAppDispatch();

  /** Redux related state */
  const divisions = useAppSelector(selectDivisions, isEqual);

  /** State */
  const [entryDivision, setDivision] = useState<string>(() => {
    if (entry) {
      return entry.division;
    }

    if (division) {
      return division;
    }

    return '';
  });

  const [player1, setPlayer1] = useState<Player>(
    entry && entry.players.length > 0
      ? cloneDeep(entry.players[0])
      : createPlayer('', '', 0)
  );
  const [player2, setPlayer2] = useState<Player>(
    entry && entry.players.length > 1
      ? cloneDeep(entry.players[1])
      : createPlayer('', '', 0)
  );
  const [p1FirstValidity, setP1FirstValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
  const [p1LastValidity, setP1LastValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
  const [p1RankingValidity, setP1RankingValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
  const [p2FirstValidity, setP2FirstValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
  const [p2LastValidity, setP2LastValidity] = useState<EntryValidity>({
    valid: true,
    msg: '',
  });
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
      const newPlayer = cloneDeep(player1);
      newPlayer.name.first = event.target.value;
      setPlayer1(newPlayer);
      // Update validity
      setP1FirstValidity(validateName(newPlayer.name.first));
    },
    [setPlayer1, setP1FirstValidity, player1]
  );

  const handleP1Last = useCallback(
    (event) => {
      const newPlayer = cloneDeep(player1);
      newPlayer.name.last = event.target.value;
      setPlayer1(newPlayer);
      // Update validity
      setP1LastValidity(validateName(newPlayer.name.last));
    },
    [setPlayer1, setP1LastValidity, player1]
  );

  const handleP1Ranking = useCallback(
    (event) => {
      const newPlayer = cloneDeep(player1);
      newPlayer.ranking = Number(event.target.value);
      setPlayer1(newPlayer);
      // Update validity
      setP1RankingValidity(validateRanking(newPlayer.ranking));
    },
    [setPlayer1, setP1RankingValidity, player1]
  );

  const handleP2First = useCallback(
    (event) => {
      const newPlayer = cloneDeep(player2);
      newPlayer.name.first = event.target.value;
      setPlayer2(newPlayer);
      // Update validity
      setP2FirstValidity(validateName(newPlayer.name.first));
    },
    [setPlayer2, setP2FirstValidity, player2]
  );

  const handleP2Last = useCallback(
    (event) => {
      const newPlayer = cloneDeep(player2);
      newPlayer.name.last = event.target.value;
      setPlayer2(newPlayer);
      // Update validity
      setP2LastValidity(validateName(newPlayer.name.last));
    },
    [setPlayer2, setP2LastValidity, player2]
  );

  const handleP2Ranking = useCallback(
    (event) => {
      const newPlayer = cloneDeep(player2);
      newPlayer.ranking = Number(event.target.value);
      setPlayer2(newPlayer);
      // Update validity
      setP2RankingValidity(validateRanking(newPlayer.ranking));
    },
    [setPlayer2, setP2RankingValidity, player2]
  );

  const closeDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSubmit = useCallback(() => {
    if (entry) {
      dispatch(
        updateEntries('modify', {
          ...cloneDeep(entry),
          division: entryDivision,
          players: [cloneDeep(player1), cloneDeep(player2)],
        })
      );
    }
    dispatch(
      updateEntries('add', {
        ranking: player1.ranking + player2.ranking,
        division: entryDivision,
        players: [cloneDeep(player1), cloneDeep(player2)],
        registrationTime: 0,
        isWaitlisted: false,
        paid: false,
      })
    );
  }, [dispatch, entryDivision, player1, player2, entry]);

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
              value={player1.name.first}
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
              value={player1.name.last}
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
              value={player1.ranking}
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
              value={player2.name.first}
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
              value={player2.name.last}
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
              value={player2.ranking}
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
          key="entry-dialog/submit"
          data-testid="entry-dialog/submit"
          onClick={closeDialog}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntryDialog;
