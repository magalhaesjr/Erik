// Creates a redux store for holding state
import {
  PreloadedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import financialReducer from './financials';
import notificationReducer from './notifications';
import tournamentReducer from './tournament';
import entryReducer from './entries';
import poolReducer from './pools';
import rootSaga from './root-saga';

const rootReducer = combineReducers({
  entries: entryReducer,
  financials: financialReducer,
  notification: notificationReducer,
  pools: poolReducer,
  tournament: tournamentReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  // Create middleware
  const sagaMiddleware = createSagaMiddleware();

  // Create the store
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sagaMiddleware),
    preloadedState,
  });

  // Start the middleware
  sagaMiddleware.run(rootSaga);

  return store;
};

// Root state for all dispatch/selectors
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
