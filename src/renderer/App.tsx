import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import Layout from './routes/Layout';
import Dashboard from './routes/Dashboard';
import CourtMap from './routes/CourtMap';
import Main from './routes/Main';
import Divisions from './routes/Divisions';
import Registration from './routes/Registration';
import Pools from './routes/Pools';
import Payouts from './routes/Payouts';
import useMainComms from './hooks/useMainComms';

export default function App() {
  // Call hook which allows for communicatin with backend main thread
  useMainComms();

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
