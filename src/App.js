import logo from './logo.svg';
import './App.css';
import Bandeau from './Bandeau';

function App() {
  return (
    <div className="App">
      <Bandeau />
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    </div>
  );
}

export default App;
