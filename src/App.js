import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './views/navbar';
import Home from './views/home';
import SignUp from './views/signup';
import { UserProvider } from './UserContext';
import Signin from './views/signin';

function App() {
  return (
    <UserProvider>
    <div className="App">
              <Router>
                <Navbar/>
                <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/signup" element={<SignUp/>} />
                  <Route path="/signin" element={<Signin/>} />
                </Routes>
              </Router>
    </div>
    </UserProvider>
  );
}

export default App;
