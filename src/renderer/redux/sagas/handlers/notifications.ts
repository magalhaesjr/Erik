/**
 * Creates generator functions for notifications
 */
import { put } from 'redux-saga/effects';
import { notify } from '../../notifications';

export function* notifyError(message: string) {
  yield put(
    notify({
      status: 'error',
      message,
    })
  );
}

export function* notifySuccess(message: string) {
  yield put(
    notify({
      status: 'error',
      message,
    })
  );
}

export function* notifyInfo(message: string) {
  yield put(
    notify({
      status: 'error',
      message,
    })
  );
}

export function* notifyWarning(message: string) {
  yield put(
    notify({
      status: 'error',
      message,
    })
  );
}
