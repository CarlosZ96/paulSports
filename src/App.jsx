import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import Leagues from './components/Leagues';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/test" element={<Leagues />} />
      </Routes>
    </div>
  );
}

export default App;
