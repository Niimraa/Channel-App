const express = require("express");
const router = express.Router();
const { Channels } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfChannels = await Channels.findAll();
  res.json(listOfChannels);
});

router.get("/:channelId", async (req, res) => {
  const channelId = req.params.channelId;
  const channel = await Channels.findByPk(channelId);
  res.json(channel);
});

router.post("/", validateToken, async (req, res) => {
  const channel = req.body;
  await Channels.create(channel);
  res.json(channel);
});

router.delete("/:channelId", validateToken, async (req, res) => {
  const channelId = req.params.channelId;

  await Channels.destroy({
    where: {
      id: channelId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;