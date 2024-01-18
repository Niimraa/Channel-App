import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/MainPage";
import AllPosts from "./pages/AllPosts";
import UsersList from "./pages/AllUsers";
import CreatePost from "./pages/NewPost";
import Post from "./pages/Post";
import ChannelsList from "./pages/AllChannels";
import Registration from "./components/UserRegistration";
import Login from "./components/UserLogin";
import Profile from "./pages/PostReply";
import PageNotFound from "./pages/InvalidPage";


function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    isAdmin: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8081/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            isAdmin: response.data.isAdmin,
          });
        }
      });
  }, [authState]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false, isAdmin: false });
    window.location.href = "/";
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
            {authState.status && (
          <div className="navbar">
              <div className="dropdown">
                <h1>Welcome {authState.username} !</h1>
                <button onClick={toggleDropdown} className="dropbtn">
                  Menu
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                  <Link to="/home"> Channels </Link>
                  <Link to="/userslist"> Users </Link>
                  <Link to="/allposts"> Posts </Link>
                  {authState.status && <button onClick={logout} > Sign Out</button>}
                  </div>
                  )}
              </div>
          </div>
            )}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/allposts" element={<AllPosts />} />
            <Route path="/userslist" element={<UsersList />} />
            <Route path="/channel/:channelId" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path='/viewChannels' element={<ChannelsList/>}/>
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;