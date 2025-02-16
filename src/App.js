import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './views/navbar';
import Home from './views/home';

function App() {
  return (
    <div className="App">
              <Router>
                <Navbar/>
                <Routes>
                  <Route path="/" element={<Home/>} />
                </Routes>
              </Router>
    </div>
  );
}

export default App;
