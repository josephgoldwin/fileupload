
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

// Set up the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure multer storage and file naming
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\.[^\.]+$/, '') + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Set file size limit and filter for allowed file types
let maxSize = 2 * 1000 * 1000;
let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        let filetype = /jpeg|jpg|png|gif|jfif|wabp/;
        let mimetype = filetype.test(file.mimetype);
        let extname = filetype.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports the following file types - jpeg, jpg, png, gif.'));
    }
}).single('mypic');

// Render the signup form on GET request
app.get('/', (req, res) => {
    res.render('signup');
});

// Handle file upload on POST request
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err instanceof multer.MulterError && err_code == 'LIMIT_FILE_SIZE') {
            return res.render('signup', { msg: 'File size is too large. Maximum file size is 2MB.' });
        }
        if (err) {
            res.render('signup', { msg: err.message });
        } else {
            res.render('signup', { msg: 'File uploaded successfully!' });
        }
    });
});

// Start the server
app.listen(1998, () => console.log('Server started on http://localhost:1998'));
