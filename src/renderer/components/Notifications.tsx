import { useCallback } from 'react';
import { Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import isEqual from 'lodash/isEqual';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectNotification, reset } from '../redux/notifications';

/** Constants */
const TIMEOUT = 60; // seconds

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
        message={message}
      />
    </>
  );
};

export default AppStatus;
