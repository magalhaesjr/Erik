import { all } from 'redux-saga/effects';
import {
  watchImportFinancials,
  watchExportFinancials,
} from './sagas/financials';

export default function* rootSaga() {
  yield all([watchImportFinancials(), watchExportFinancials()]);
}
