import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const CreateChannel = ()=> {
  const navigate = useNavigate();
  const initialValues = {
    channelName: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    channelName: Yup.string().required("Channel Name is required"),
  });

  const onSubmit = (data) => {
    fetch("http://localhost:8081/channels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accessToken: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create channel");
        }
        return response.json();
      })
      .then(() => {
        window.alert("Channl Created Success fully");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div className="createPostPage">
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form className="formContainer">
        <h3 style={{ textAlign: "center" }}> Create Channel</h3>
        <ErrorMessage name="title" component="span" />
        <Field
          autoComplete="off"
          id="inputCreatePost"
          name="channelName"
          placeholder="Channel Name"
        />
        <div style={{display:"flex"}}> 
        <button type="submit"> Create Channel</button>
        <Link to='/viewChannels'>
        <button type="submit"> View All Channels</button>
        </Link>
        </div>
        
      </Form>
    </Formik>
    </div>
  );
}

export default CreateChannel;