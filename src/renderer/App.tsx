import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { useStore } from 'react-redux';
import { useAppDispatch } from './redux/hooks';
import theme from './theme';
import Layout from './routes/Layout';
import Dashboard from './routes/Dashboard';
import CourtMap from './routes/CourtMap';
import Main from './routes/Main';
import Divisions from './routes/Divisions';
import Registration from './routes/Registration';
import Pools from './routes/Pools';
import Payouts from './routes/Payouts';
import { loadTournament } from './redux/tournament';
import Tournament from '../domain/tournament';

export default function App() {
  const store = useStore();
  const dispatch = useAppDispatch();
  // Set the window functions from menu clicks
  window.electron.requestSave(() => {
    window.electron.saveTournament(store.getState());
  });

  window.electron.requestLoad(() => {
    window.electron
      .loadTournament()
      .then((tourny: unknown) => {
        dispatch(loadTournament(tourny as Tournament));
        return 0;
      })
      .catch((errors: unknown) => {
        // eslint-disable-next-line no-console
        console.log(errors);
      });
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courtmap" element={<CourtMap />} />
            <Route path="/divisions" element={<Divisions />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/pools" element={<Pools />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
