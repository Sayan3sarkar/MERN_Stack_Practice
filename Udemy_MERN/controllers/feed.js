const { validationResult } = require("express-validator");
const fs = require('fs');
const path = require('path');

const Post = require("../models/post");
const User = require('../models/user');

/**
 * Controller to view all posts
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const itemsPerPage = 2;
    let totalItems;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * itemsPerPage)
                .limit(itemsPerPage);
        })
        .then(posts => {
            res.status(200).json({
                message: 'Fetched Posts Successfully',
                posts: posts,
                totalItems: totalItems
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

/**
 * Controller to create a new post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error; // Since, this is synchronous code, throw will exit the function execution and return to the registered error middlware
    }
    if (!req.file) {
        const error = new Error('No Image Found');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const { title, content } = { ...req.body };
    let creator;
    const post = new Post({
        title: title,
        content: content,
        creator: req.userId,
        imageUrl: imageUrl,
    });
    post
        .save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Post Created successfully",
                post: post,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err); // Since, this is inside an async block, we have to use next() to pass the error onto the next registered middleware
        });
};

/**
 * Controller to fetch a single post by ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getPostById = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error("Couldn't find post with the given ID");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Post fetched',
                post: post
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

/**
 * Controller to update a specific post by ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.updatePostById = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error; // Since, this is synchronous code, throw will exit the function execution and return to the registered error middlware
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No File Picked');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error("Couldn't find post with the given ID");
                error.statusCode = 404;
                throw error;
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not Authorized');
                error.status = 403;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Post Updated',
                post: result
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

/**
 * Controller to delete a post by ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deletePostById = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No Post found');
                error.statusCode = 404;
                throw error;
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not Authorized');
                error.status = 403;
                throw error;
            }
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId); // pull() reomves an item from an array in mongodb
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Post Deleted'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

/**
 * Helper method to clear image from server
 * @param {*} filePath 
 */
const clearImage = filePath => {
    FilePath = path.join(__dirname, '..', filePath);
    fs.unlink(FilePath, err => console.log(err));
};