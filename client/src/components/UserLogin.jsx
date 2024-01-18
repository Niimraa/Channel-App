import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Login = ()=> {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = async () => {
    const data = { username: username, password: password };

    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.error) {
        alert(responseData.error);
      } else {
        localStorage.setItem("accessToken", responseData.token);
        setAuthState({
          username: responseData.username,
          id: responseData.id,
          status: true,
        });
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="registrationLoginPage">
      <div className="formContainer">
        <label>Username:</label>
        <input
          type="text"
          id="inputCreatePost"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label>Password:</label>
        <input
          id="inputCreatePost"
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <button onClick={login}> Login </button>
        <div className="no-account-div">
          <p>Don't have an account?</p>
          <Link style={{ color: "blue" }} to="/registration">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;