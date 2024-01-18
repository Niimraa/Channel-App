import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const UsersList = ()=> {
  const [listOfUsers, setListOfUsers] = useState([]);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      fetch("http://localhost:8081/auth", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
        .then((response) => response.json())
        .then((data) => {
          setListOfUsers(data);
        });
    }
  }, [navigate]);

  const deleteUser = (userId) => {
    fetch(`http://localhost:8081/users/${userId}`, {
      method: "DELETE",
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
      .then(() => {
        const updatedUsers = listOfUsers.filter((user) => user.id !== userId);
        setListOfUsers(updatedUsers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="channelsList">
      <h2> All Users</h2>
      <div style={{display: "flex", flexWrap: 'wrap', justifyContent: "space-evenly"}}>
        {listOfUsers.map((value, key) => {
          return (
            <div key={key} className="channel">
              {authState.username === "admin" ? (
                <>
                  <label style={{ color: "white" }}> {value.username} </label>
                  <button onClick={() => deleteUser(value.id)}>Delete User</button>
                </>
              ) : (
                <Link to={`/profile/${value.id}`}> {value.username} </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsersList;
