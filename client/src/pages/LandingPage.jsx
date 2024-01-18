import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <h1>Channel-Based Tool for Programming Issues</h1>


      <p>This app focuses on designing and implementing a  Channel-Based Tool for Programming Issues which allows users to create channels as well as Post programming questions, create messages and replies. you can rate posts as well!!!. </p>

      <p>The user interface is implemented in ReactJS, NodeJS with all data stored in a MySQL database.</p>
 
      <Link to="/login" className="button-style">Login</Link>
    </div>
  );
};

export default LandingPage;