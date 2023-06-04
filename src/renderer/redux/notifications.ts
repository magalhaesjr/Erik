import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import clone from 'lodash/clone';
import type { RootState } from './store';

/** Types */
// Status is from MUI V5 snackbar severity
export type Status = 'none' | 'success' | 'info' | 'warning' | 'error';

export type Notification = {
  status: Status;
  message: string;
};

/** State */
export const normalStatus: Notification = {
  status: 'none',
  message: '',
};

/** Slice */
export const notificationSlice = createSlice({
  name: 'notification',
  initialState: normalStatus,
  reducers: {
    notify: (_, payload: PayloadAction<Notification>) => {
      // Use current state, in case the payload is missing any information
      return payload.payload;
    },
    reset: () => {
      return clone(normalStatus);
    },
  },
});

export const { notify, reset } = notificationSlice.actions;
export default notificationSlice.reducer;

export const selectNotification = (state: RootState): Notification => {
  return state.notification;
};
