import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThumbsUp from "../images/ThumbsUp.png";
import ThumbsDown from "../images/ThumbsDown.png";
import { AuthContext } from "../helpers/AuthContext";

function Channel() {
  let { channelId } = useParams();

  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [dislikedPosts, setDislikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  // Get all posts from the database
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get(`http://localhost:8081/posts/byChannelId/${channelId}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
          setDislikedPosts(
            response.data.dislikedPosts.map((dislike) => {
              return dislike.PostId;
            })
          );
        });
    }
  }, [navigate, authState.status, channelId]);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:8081/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes > 0 ? [...post.Likes] : [];
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  const dislikeAPost = (postId) => {
    axios
      .post(
        "http://localhost:8081/dislikes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        console.log(response.data)
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.disliked) {
                console.log(post.Dislikes)
                return { ...post, Dislikes: [...post.Dislikes, 0] };
              } else {
                const dislikesArray = post.Dislikes > 0 ? [...post.Dislikes] : [];
                dislikesArray.pop();
                return { ...post, Dislikes: dislikesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (dislikedPosts.includes(postId)) {
          setDislikedPosts(
            dislikedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setDislikedPosts([...dislikedPosts, postId]);
        }
      });
    console.log(dislikedPosts)
  };


  return (
    <div>
      <h2>All posts in the channel</h2>
      <div style={{display: "flex", justifyContent: "space-around", flexWrap: "wrap"}}>
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
              <div className="username">
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
              </div>
              <div className="buttons">
                <img
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                  src={ThumbsUp}
                  alt="like"
                />
                <label> {value.Likes ? value.Likes.length : 0}</label>

                <img
                    onClick={() => {
                      dislikeAPost(value.id);
                    }}
                    className={
                      dislikedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                    }
                    src={ThumbsDown}
                    alt="Dislike"
                  />

                  <label> {value.Dislikes ? value.Dislikes.length : 0}</label>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default Channel;
