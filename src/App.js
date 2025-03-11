import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './views/navbar';
import Home from './views/home';
import SignUp from './views/signup';
import { UserProvider } from './UserContext';
import Signin from './views/signin';
import { useEffect, useState } from 'react';
import Favorites from './views/favorites';

function App() {

  const [posts, setPosts] = useState([]);

  return (
    <UserProvider>
    <div className="App">
              <Router>
                <Navbar/>
                <Routes>
                  <Route path="/" element={<Home setPosts={setPosts} posts={posts}/>} />
                  <Route path="/signup" element={<SignUp/>} />
                  <Route path="/signin" element={<Signin/>} />
                  <Route path="/favorites" element={<Favorites/>} />
                </Routes>
              </Router>
    </div>
    </UserProvider>
  );
}

export default App;
