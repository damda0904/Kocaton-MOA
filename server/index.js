const express = require('express');
const app = express();
const cors = require('cors');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})


const config = require("./config/key");

const { Chat } = require('./models/Chat');

const mongoose = require('mongoose');
const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/user', require('./routes/user'));
app.use('/api/video', require('./routes/video'));
app.use('/api/image', require('./routes/image'));
app.use('/api/liveVideo', require('./routes/liveVideo'));
app.use('/api/like', require('./routes/like'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/chat', require('./routes/chat'));


app.use('/uploads', express.static('uploads'));


let broadcaster;
io.on('connection', socket => {

  /* live video */
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    console.log("broadcaster set: ", broadcaster)
    socket.emit("broadcaster", broadcaster);
  })

  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
    console.log("watcher set: ", socket.id);
    console.log("broadcasterId: ", broadcaster);
  })

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
    console.log("offer sent: ", message);
  })

  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
    console.log("answer sent");
  })

  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
    console.log("candidate", message);
  })

  /* live chat */
  socket.on("Input Chat Message", msg => {
    connect.then(db => {
      try {
        let chat = new Chat({ message: msg.chatMessage, sender: msg.userId, type: msg.type })
        
        chat.save((err, doc) => {
          if (err) return res.json({ success: false, err })
          Chat.find({ "_id": doc._id })
            .populate('sender')
            .exec((err, doc) => {
              return io.emit('Output Chat Message', doc);
            })
        })
      } catch(e) {
        console.error(e);
      }
    })
  })
})



if (process.env.NODE_ENV === "production") {
    
    app.use(express.static("client/build"));
      
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
  }
  


const port = 5000;
server.listen(port, () => console.log(`App listening on port ${port}`))