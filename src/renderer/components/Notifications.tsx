import { useCallback } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import isEqual from 'lodash/isEqual';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectNotification, reset } from '../redux/notifications';

/** Constants */
const TIMEOUT = 10; // seconds

const action = (onClose: () => void) => {
  return (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
    </>
  );
};

const AppStatus = () => {
  /** State Management */
  const dispatch = useAppDispatch();
  const { status, message } = useAppSelector(selectNotification, isEqual);

  const onClose = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <>
      <Snackbar
        open={status !== 'none'}
        autoHideDuration={TIMEOUT * 1000}
        onClose={onClose}
        action={action(onClose)}
      >
        <Alert severity={status !== 'none' ? status : undefined}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppStatus;
