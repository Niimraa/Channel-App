import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import ThumbsUp from "../images/ThumbsUp.png";

const Profile = ()=> {
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:8081/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`http://localhost:8081/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, [id]);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        {" "}
        <h1 style={{ marginLeft: "50px" }}> Username: {username} </h1>
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <img src={ThumbsUp} alt="like" />
                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
