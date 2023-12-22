require("dotenv").config()
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

// user profile
const userInfo = require('./routes/userrouter')
app.use('/api/bookish', userInfo)

const homeFeed = require('./routes/homerouter')
app.use('/api/bookish', homeFeed);

const createPost = require('./routes/createpost')
app.use('/api/bookish', createPost);

const bookInfo = require('./routes/bookrouter')
app.use('/api/bookish', bookInfo);

//Connecting to DB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 1000,
    useUnifiedTopology: true,
    useCreateIndex: true
  }, function (err, res) {
        try {
            console.log('Connected to Database');
        } catch (err) {
            console.log(err);
        }
    } 
);

app.listen(process.env.PORT, () => console.log('Listening on Port 3000'));
