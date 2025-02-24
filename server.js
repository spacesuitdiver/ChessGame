require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const routes = require('./routes');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./users.js');

// var db = require('./model');

const PORT = process.env.PORT || 3001;
// const router = require('./router');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// app.use(router);
// const server = require('http').Server(app);

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use(cors());

// const io = socketio(server);

// PASSPORT CONFIG
require("./config/passport")(passport)

// SENDING EVERY OTHER REQUEST TO THE REACT APP AND DEFINE ANY API ROUTES BEFORE THIS RUNS
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// CONNECT TO THE MONGO DATABASE
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/chess_game', { useNewParser: true }, function (err) {
    console.log('connected to mongo database');
});

// START THE SERVER
// db.sequelize.sync(syncOptions).then(function () {
server.listen(PORT, () => {
    console.log(`==> 🌎  API Server now listening on PORT ${PORT}! `,

    );
});

// let room;


io.on("connection", socket => {
    console.log('We have a new connection!!');


    socket.on('join', ({ name, room }, callback) => {
        // room = room;
        console.log('yep connected')
        // const chatRooms = {
        //     [room] : []
        // }

        // chatRooms[room] = [].concat(name)

        const { error, user } = addUser({ id: socket.id, name, room });

        const amountOfUsers = getUsersInRoom(room).length;

        if (amountOfUsers > 2) {
            // console.log('what the ????')
            return;
        }


        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!` });


        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

        callback();

    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();


    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        console.log('user left room')

        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` })
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

        }
    })

});







