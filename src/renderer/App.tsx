import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import Layout from './routes/Layout';
import Dashboard from './routes/Dashboard';
import CourtMap from './routes/CourtMap';
import Main from './routes/Main';
import Divisions from './routes/Divisions';
import Financials from './routes/Financials';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courtmap" element={<CourtMap />} />
            <Route path="/divisions" element={<Divisions />} />
            <Route path="/financials" element={<Financials />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
