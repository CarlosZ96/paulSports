import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
      </header>
    </div>
  );
}

export default App;
