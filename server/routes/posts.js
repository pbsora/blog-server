const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const jwt = require("jsonwebtoken");

router.post("/auth", verifyToken, (req, res) => {
  res.send(req.user);
});

router.get("/post", async (req, res) => {
  try {
    const posts = await Post.find({ public: true })
      .sort({ postedAt: -1 })
      .exec();

    res.send(posts);
  } catch (error) {
    console.log(error);
  }
});

router.post("/post", async (req, res) => {
  try {
    const { title, post, public } = req.body;
    const newPost = new Post({
      title,
      post,
      public,
    });
    await newPost.save();
    const url = await Post.findById(newPost.id, { slug: 1 });
    res.status(201).json({ message: "Post created sucessfully", slug: url });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/post/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const post = await Post.findOne(
      { slug },
      { title: 1, post: 1, postedAt: 1 }
    ).exec();
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
  }
});

router.get("/post/:id/comment", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .sort({ createdAt: -1 })
      .exec();
    res.send(comments);
  } catch (error) {
    console.log(error);
  }
});

router.post("/post/:id/comment", async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, author } = req.body;

    const comment = new Comment({
      content,
      author,
      postId,
    });
    await comment.save();
    res.status(201).json({ message: "Commented sucessfully" });
  } catch (error) {
    console.log(error);
  }
});

//Verify token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  const bearerToken = bearerHeader.split(" ")[1];
  if (bearerHeader == null) return res.status(401);

  jwt.verify(bearerToken, "puguinho", (err, user) => {
    if (err) return res.send("Token not valid");
    req.user = user;
    next();
  });

  req.token = bearerToken;

  next();
}
module.exports = router;
