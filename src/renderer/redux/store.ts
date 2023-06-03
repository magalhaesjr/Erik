// Creates a redux store for holding state
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
// import appReducer from './reducer';
import financialReducer from './financials';
import notificationReducer from './notifications';
import tournamentReducer from './tournament';
import rootSaga from './root-saga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    financials: financialReducer,
    notification: notificationReducer,
    tournament: tournamentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// Root state for all dispatch/selectors
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
