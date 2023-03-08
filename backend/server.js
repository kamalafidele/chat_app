const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const routeHandler = require('./src/routes');

dotenv.config();
const { mongodbOptions } = require('./src/config');

const { PORT, HOST, MONGODB_DEV, MONGODB_PROD, ENV_MODE } = process.env;

const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server, {
  cors: { origin: '*', methods: ['POST', 'GET'] },
});


mongoose.set('strictQuery', false);
mongoose
  .connect(ENV_MODE === 'dev' ? MONGODB_DEV : MONGODB_PROD, mongodbOptions)
  .then(() => console.log('Successfully connected to MongoDb'))
  .catch((e) => console.log('Could not connect to MongoDb', e));

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

  socket.on('user_joined', (data) => {
    users.push(data);
    io.emit('usersList', users);
  });

  socket.on('message', (data) => {
    io.emit('messageRes', data);
  });


  socket.on('user_left', (user_id) => {
    users = users.filter((user) => user._id !== user_id);
    io.emit('usersList', users);
  });
  
  socket.on('disconnect', () => {
    socket.disconnect();
  });
});

app.use('/api/v1/', routeHandler);

app.use((req, res) => res.status(404).json({ error: 'We cannot get what you are looking for!' }));

server.listen(PORT, () => {
  console.log(`APP RUNNING ON ${HOST}:${PORT}`);
});
