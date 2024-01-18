import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

const Comment = ({ comment, onDelete })=> {
  const { authState } = useContext(AuthContext);

  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  const addReply = () => {
    axios
      .post(
        "http://localhost:8081/comments",
        {
          commentBody: newReply,
          PostId: comment.PostId,
          parentId: comment.id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const replyToAdd = {
            commentBody: newReply,
            username: response.data.username,
          };
          setReplies([...replies, replyToAdd]);
          setNewReply("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:8081/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        if (onDelete) {
          onDelete(id);
        }
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8081/comments/${comment.id}`)
      .then((response) => {
        setReplies(response.data);
      });
  }, [comment]);

  return (
    <div className="comment">
      <label>{comment.username}: </label>
      {comment.commentBody}
      {authState.username === "admin" && (
        <button onClick={() => deleteComment(comment.id)}>Delete</button>
      )}
      <div className="replies">
        {replies.map((reply) => (
          <Comment key={reply.id} comment={reply} onDelete={onDelete} />
        ))}
      </div>
      <div className="addReplyContainer">
        <input
          type="text"
          placeholder="Reply"
          autoComplete="off"
          value={newReply}
          onChange={(event) => {
            setNewReply(event.target.value);
          }}
        />
        <button onClick={addReply}>Add Reply</button>
      </div>
    </div>
  );
}

export default Comment;