const express = require("express");
const router = express.Router();
const { Dislikes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  const found = await Dislikes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  if (!found) {
    await Dislikes.create({ PostId: PostId, UserId: UserId });
    res.json({ disliked: true });
  } else {
    await Dislikes.destroy({
      where: { PostId: PostId, UserId: UserId },
    });
    res.json({ disliked: false });
  }
});

module.exports = router;