import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { useStore, useDispatch } from 'react-redux';
import theme from './theme';
import Layout from './routes/Layout';
import Dashboard from './routes/Dashboard';
import CourtMap from './routes/CourtMap';
import Main from './routes/Main';
import Divisions from './routes/Divisions';
import Registration from './routes/Registration';
import Pools from './routes/Pools';
import Payouts from './routes/Payouts';

export default function App() {
  const store = useStore();
  const dispatch = useDispatch();
  // Set the window functions from menu clicks
  window.electron.requestSave(() => {
    window.electron.saveTournament(store.getState());
  });

  window.electron.requestLoad(() => {
    window.electron
      .loadTournament()
      .then((tourny: unknown) => {
        dispatch({ type: 'loadTournament', payload: tourny });
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
