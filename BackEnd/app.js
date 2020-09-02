//Initializing all Package
var express = require("express");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
const Chat = require("./models/message");

var chat = require("./routes/chat");
const authRoutes = require("./routes/auth");

var app = express();
var router = express.Router();

//Middlewares
//app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
//Static Path Join
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// Routes
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

app.use("/", chat);
app.use("/auth", authRoutes);

//MongoDb Connection
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
let con = mongoose.connect(
  "mongodb+srv://testsourav:testsourav@cluster0.rlosk.mongodb.net/chatdata?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
con
  .then(() => {
    console.log("Connected to MongoDB!!");
    const server = app.listen(3000);
    //Socket.io connection
    const io = require("./socket").init(server);
    io.on("connection", function (socket) {
      console.log("User connected");

      socket.on("disconnect", function (socket) {
        console.log("user disconnected");
      });
      //     //join room
      socket.on("join", function (data) {
        console.log(data.user);
        socket.join();
        console.log(data.user + " joined the chat");

        //inform other on the room about event
        socket.broadcast.emit("new user joined", {
          user: data.user,
          message: "has joined this room ",
        });
      });
      //leave room

      socket.on("leave", function (data) {
        console.log(data.user + "has left the room " + data.room);
        socket.broadcast.emit("left room", {
          user: data.user,
          message: "has left the room ",
        });
        socket.leave(data.room);
      });
      //sending message
      socket.on("message", function (data) {
        //  console.log(data.message);

        socket.emit("new message", {
          user: data.user,
          message: data.message,
        });
        con.then((db) => {
          console.log("connected correctly to the server");
          let chatMessage = new Chat({
            content: data.message,
            creator: data.user,
          });

          chatMessage.save();
        });
      });
    });
  })
  .catch((err) => console.log(err));

module.exports = app;
