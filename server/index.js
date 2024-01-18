const express = require("express");
const app = express();
const path = require("path")
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const cors = require("cors");

app.use(express.json());
app.use(cors());


const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("mysql://root:haleema22@localhost:3306", {
  dialect: "mysql",
});

sequelize.query("CREATE DATABASE IF NOT EXISTS chatdb;")
  .then(() => {
    const db = require("./models");

    // Routers
    const channelsRouter = require("./routes/Channels");
    app.use("/channels", channelsRouter);
    const postRouter = require("./routes/Posts");
    app.use("/posts", postRouter);
    const commentsRouter = require("./routes/Comments");
    app.use("/comments", commentsRouter);
    const usersRouter = require("./routes/Users");
    app.use("/auth", usersRouter);
    const likesRouter = require("./routes/Likes");
    app.use("/likes", likesRouter);
    const dislikesRouter = require("./routes/Dislikes");
    app.use("/dislikes", dislikesRouter);
    
    db.sequelize.sync().then(() => {
      app.listen(8081, () => {
        console.log("Server running on port 8081");
      });
    });
  })
  .catch((error) => {
    console.error("Error creating database: ", error);
  });
