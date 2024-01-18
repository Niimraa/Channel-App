const express = require("express");
const router = express.Router();

const path = require("path");
const multer = require("multer");
const { Posts, Likes, Dislikes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");



const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});


const upload = multer({ storage: storage });
router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes], include: [Dislikes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  const dislikedPosts = await Dislikes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts, dislikedPosts: dislikedPosts });
});

router.get("/byChannelId/:channelId", validateToken, async (req, res) => {
  const channelId = req.params.channelId;
  console.log(channelId)
  console.log(req.params)
  const listOfPosts = await Posts.findAll({
    where: { ChannelId: channelId },
    include: [Likes],
    include: [Dislikes]
  });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  const dislikedPosts = await Dislikes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts, dislikedPosts: dislikedPosts });
});

router.post("/:channelId", validateToken, upload.single("image"), async (req, res) => {
  try {
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id;
    post.ChannelId = req.params.channelId;
    console.log(req.params)
    console.log(post.ChannelId)
    post.uploadImage = req.file ? req.file.filename : null;

    await Posts.create(post);
    res.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/:channelId", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  post.ChannelId = req.params.channelId;
  await Posts.create(post);
  res.json(post);
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;