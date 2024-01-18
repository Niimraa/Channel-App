import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const ChannelsList = ()=> {
  const [listOfChannels, setListOfChannels] = useState([]);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      fetch("http://localhost:8081/channels", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
        .then((response) => response.json())
        .then((data) => {
          setListOfChannels(data);
        })
        .catch((error) => {
          console.error("Error fetching channels:", error);
        });
    }
  }, [navigate, authState.status]);

  const deleteChannel = (channelId) => {
    fetch(`http://localhost:8081/channels/${channelId}`, {
      method: "DELETE",
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
      .then(() => {
        const updatedChannels = listOfChannels.filter(
          (channel) => channel.id !== channelId
        );
        setListOfChannels(updatedChannels);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="channelsList">
      <div style={{ display: "flex" }}>
        <h2>Displaying All Channels</h2>
        <Link to="/home">
          <button style={{ height: "40px", width: "100px", marginLeft: "120px" }}>
            Back
          </button>
        </Link>
      </div>
      <div style={{ display: "flex", flexWrap: 'wrap', justifyContent: "space-evenly" }}>
        {listOfChannels.map((value, key) => {
          return (
            <div key={key} className="channel">
              {authState.username === "admin" ? (
                <React.Fragment>
                  <label style={{ color: "white" }}>{value.channelName}</label>
                  <button onClick={() => deleteChannel(value.id)}>
                    Delete Channel
                  </button>
                </React.Fragment>
              ) : (
                <Link to={`/channel/${value.id}`}>
                  {key + 1} {value.channelName}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChannelsList;
