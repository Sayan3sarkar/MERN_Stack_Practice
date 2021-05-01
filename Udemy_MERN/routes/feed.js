const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require('../middleware/isAuth');

const feedController = require("../controllers/feed");


// GET /feed/posts. To get all Posts
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post. To create a new post
router.post(
    "/post",
    isAuth,
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.createPost
);

// GET /feed/post/:postId. To fetch a single post by ID
router.get('/post/:postId', isAuth, feedController.getPostById);

// PUT /feed/post/:postId. To update a single post by ID
router.put(
    '/post/:postId',
    isAuth,
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 })
    ],
    feedController.updatePostById);

// DELETE /feed/post/:postId. To delete a single post by ID
router.delete('/post/:postId', isAuth, feedController.deletePostById)

module.exports = router;
