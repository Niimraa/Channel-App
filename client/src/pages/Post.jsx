import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Comment from "../components/UserComments";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8081/posts/byId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPostObject(data);
      });

    fetch(`http://localhost:8081/comments/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      });
  }, [id]);

  const deletePost = (id) => {
    fetch(`http://localhost:8081/posts/${id}`, {
      method: "DELETE",
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then(() => {
        navigate("/home");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      fetch("http://localhost:8081/posts/title", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          newTitle: newTitle,
          id: id,
        }),
      });

      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text:");
      fetch("http://localhost:8081/posts/postText", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          newText: newPostText,
          id: id,
        }),
      });

      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  const addComment = () => {
    fetch("http://localhost:8081/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accessToken: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        commentBody: newComment,
        PostId: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setComments([
            ...comments,
            {
              commentBody: newComment,
              username: data.username,
            },
          ]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    fetch(`http://localhost:8081/comments/${id}`, {
      method: "DELETE",
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div style={{ display: "flex", gap: "12px", fontWeight: "Bold", color: "white", margin: "20px" }} id="individual">
          <div onClick={() => { editPost("title"); }}>
            You are replying in {postObject.title}
          </div>
          <div onClick={() => { editPost("body"); }}>
            With Message {postObject.postText}
          </div>
          <div>
            posted By {postObject.username}
            {authState.username === "admin" && (
              <button onClick={() => { deletePost(postObject.id); }}> Delete Post</button>
            )}
          </div>
        </div>
        {postObject.uploadImage && (
          <div>
            {console.log(`http://localhost:8081/uploads/${postObject.uploadImage}`)}
            <img
              src={`http://localhost:8081/uploads/${postObject.uploadImage}`}
              alt="Post Image"
              style={{ maxWidth: "100%", maxHeight: "200px", margin: "20px" }}
            />
          </div>
        )}

      </div>
      <div className="rightSide">
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <Comment key={key} comment={comment} onDelete={deleteComment} />
            );
          })}
        </div>
        {authState.username !== "admin" && (
          <div className="addCommentContainer">
            <input
              type="text"
              placeholder="Reply"
              autoComplete="off"
              value={newComment}
              onChange={(event) => { setNewComment(event.target.value); }}
            />
            <button onClick={addComment}>Add Reply</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
