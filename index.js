require("dotenv").config()
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
const socketio = require('socket.io');

// user profile
const userInfo = require('./routes/userrouter')
app.use('/api/bookish', userInfo)

const homeFeed = require('./routes/homerouter')
app.use('/api/bookish', homeFeed);

const createPost = require('./routes/createpost')
app.use('/api/bookish', createPost);

const bookInfo = require('./routes/bookrouter')
app.use('/api/bookish', bookInfo);

const exchangeRouter = require('./routes/bookexchange')
app.use('/api/bookish', exchangeRouter);

const notificationRoute = require('./routes/notificationroute')
app.use('/api/bookish', notificationRoute);

const bookCategory = require('./routes/categoryrouter')
app.use('/api/bookish', bookCategory);

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

const server = app.listen(1337, () => {
    console.log('Server running!')
});

const io = socketio(server)

io.on('scoketConnection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.emit('notification', 'Thanks for connecting to Codedamn!')
})
