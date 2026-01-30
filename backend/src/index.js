//Main file, this makes everything work properly
require('dotenv').config();

const cors = require('cors');

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

//routes
const reservationsRoute = require('../routes/reservations.routes');
const authRoute = require('../routes/auth.routes');
const verifyToken = require('../middleware/auth.middleware');
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);


initSocket(server);


//global middlewares
app.use(express.json());
app.use(cors());

//endpoints
app.use('/auth', authRoute);
app.use('/reservations', verifyToken, reservationsRoute);

server.listen(process.env.PORT, () => {
    console.log(`Server running in port: ${process.env.PORT}`);
});