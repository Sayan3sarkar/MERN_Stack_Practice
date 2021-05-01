const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

/**
 * Multer Storage method to configure the destination and filename of files uploaded
 */
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

/**
 * Multer filter to accept only certain types(mimetype) of images
 * @param {*} req 
 * @param {*} file 
 * @param {*} cb 
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(express.json());

// Registering multer middleware
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// Any request to '/images' would be redirected to 'images' directory. The 'images' directory is served as a static folder
app.use('/images', express.static(path.join(__dirname, 'images'))); // __dirname indicates current path of app.js, we join
// this path with 'images' folder using path.join() and make the resultant path as static using express.static

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    next();
});

// Routes for endpoints
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Error Handling Middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
})

mongoose.connect('mongodb+srv://Sayan3sarkar:Sayan1234@cluster0.qv4tn.mongodb.net/MERN_STACK?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('Connected to Database');
        app.listen(8080);
    })
    .catch(err => console.log(err))