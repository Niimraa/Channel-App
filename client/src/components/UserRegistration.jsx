import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Registration = ()=> {
  const initialValues = {
    username: "",
    password: "",
  };

  let navigate = useNavigate();

  //password requirements 
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required("Required"),
    password: Yup.string().min(4).max(20).required("Required"),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8081/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log(data);
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        // Handle registration failure, e.g., show an error message
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Handle unexpected errors, e.g., show an error message
    }
  };

  return (
    <div className="registrationLoginPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field autoComplete="off" id="inputCreatePost" name="username" />

          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
          />

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
