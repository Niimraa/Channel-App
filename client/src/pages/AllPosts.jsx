import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ThumbsUp from "../images/ThumbsUp.png";
import ThumbsDown from "../images/ThumbsDown.png";
import { AuthContext } from "../helpers/AuthContext";

function AllPosts() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [dislikedPosts, setDislikedPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:8081/posts", {
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
  }, [navigate, authState.status]);

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

  const filteredPosts = useMemo(() => {
    let result = listOfPosts;

    if (searchKeyword) {
      result = result.filter(
        (post) =>
          (post.title?.toLowerCase() || "").includes(searchKeyword.toLowerCase()) ||
          (post.postText?.toLowerCase() || "").includes(searchKeyword.toLowerCase())
      );
    }
  
    if (searchUser) {
      result = result.filter((post) =>
        (post.username?.toLowerCase() || "").includes(searchUser.toLowerCase())
      );
    }
  

    return result;
  }, [searchKeyword, searchUser, listOfPosts]);


  const sortByMostLiked = () => {
    setListOfPosts([...listOfPosts].sort((a, b) => {
      return (b.Likes?.length || 0) - (a.Likes?.length || 0);
    }));
  };
  

  const sortByMostDisliked = () => {
    setListOfPosts([...listOfPosts].sort((a, b) => b.Dislikes.length - a.Dislikes.length));
  };
  

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginTop: "50px" }}>
        <label style={{ fontSize: "20px", marginLeft: "50px", fontWeight: "bold" }}>Search:</label>
        <input
          type="text"
          placeholder="Keyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{
            border: "1px solid lightblue",
            padding: "10px",
            borderRadius: "5px",
            width: "200px",
            height: "15px",
            fontSize: "15px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        />
        <input
          type="text"
          placeholder="User"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          style={{
            border: "1px solid lightblue",
            padding: "10px",
            borderRadius: "5px",
            width: "200px",
            height: "15px",
            fontSize: "15px",
          }}
        />
        <label style={{ fontSize: "20px", marginLeft: "100px", fontWeight: "bold" }}>
          Filter:
        </label>
        <button
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "5px",
            borderRadius: "5px",
            fontSize: "15px",
          }}
          onClick={sortByMostLiked}
        >
          Most Liked
        </button>
        <button
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "15px",
          }}
          onClick={sortByMostDisliked}
        >
          Most Disliked
        </button>
      </div>

      <h2 style={{ margin: "50px" }}>All Posts</h2>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
        {filteredPosts.map((value, key) => {
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

export default AllPosts;
