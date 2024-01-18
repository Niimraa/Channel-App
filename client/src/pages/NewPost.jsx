import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import Channel from "./Channel";

const CreatePost = () => {
  let { channelId } = useParams();
  const [visible, setVisible] = useState(false);
  // let navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
    image: null,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    postText: Yup.string().required("Required"),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log(channelId)
    formData.append("title", data.title);
    formData.append("postText", data.postText);
    formData.append("image", data.image);
    formData.append("channelId", channelId);

    try {
      await fetch(`http://localhost:8081/posts/${channelId}`, {
        method: "POST",
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
        body: formData,
      });
      window.alert("Post Created Successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="createPostPage">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ setFieldValue }) => (
            <Form className="formContainer">
              <h3 style={{ textAlign: "center" }}> Create Post</h3>
              <ErrorMessage name="title" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="title"
                placeholder="Topic"
              />
              <ErrorMessage name="postText" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="postText"
                placeholder="Type"
              />
              <input
                type="file"
                id="image"
                name="image"
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }}
              />
              <div>
                <button type="submit"> Create Post</button>
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? "Hide My All Posts" : "View My All Posts"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {visible && ( <Channel />)}
    </div>
  );
}

export default CreatePost;
