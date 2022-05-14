import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>NVC Tournament Manager</h1>
      <h2>Erik</h2>
      <div className="Hello">
        <button type="button" onClick={window.electron.importFile}>
          New Tournament
        </button>
        <button type="button" onClick={window.electron.showContents}>
          Show Contents
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
