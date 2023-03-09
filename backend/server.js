const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const { PORT, HOST } = process.env;

const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server, {
  cors: { origin: '*', methods: ['POST', 'GET'] },
});

app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

let users = [];

io.on('connection', (socket) => {

  socket.on('newUser', (data) => {
    users.push(data);
    io.emit('newUserResponse', users);
  });

  socket.on('message', (data) => {
    io.emit('messageResponse', data);
  });

  socket.on('typing', data => { 
    io.emit('typingResponse', data);
  });

  socket.on('userLeft', (data) => {
    users = users.filter((user) => user.socketId !== data.socketId);
    io.emit('newUserResponse', users);
  });
  
  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('newUserResponse', users);
  
    socket.disconnect();
  });
});

app.use((req, res) => res.status(404).json({ error: 'We cannot get what you are looking for!' }));

server.listen(PORT, () => {
  console.log(`APP RUNNING ON ${HOST}:${PORT}`);
});
