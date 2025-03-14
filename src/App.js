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
import LiveStreamPlayer from './views/lifestream';

function App() {

  const [posts, setPosts] = useState([]);
  const playbackUrl = "https://2094d881f698.us-east-1.playback.live-video.net/api/video/v1/us-east-1.960406969154.channel.kMx6ZWDl3yer.m3u8";

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
                  <Route path="/live" element={<LiveStreamPlayer playbackUrl={playbackUrl}/>} />
                </Routes>
              </Router>
    </div>
    </UserProvider>
  );
}

export default App;
