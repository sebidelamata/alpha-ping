import express from 'express'
const app = express()
import dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT || 3030
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}\n`))

let messages = [
  {
    id: 0,
    channel: "1",
    account: "0xcA8Fa8f0b631EcdB18Cda619C4Fc9d197c8aFfCa",
    text: "Welcome to AlphaPING!",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
  {
    id: 1,
    channel: "2",
    account: "0xcA8Fa8f0b631EcdB18Cda619C4Fc9d197c8aFfCa",
    text: "Welcome to AlphaPING everyone! My name is John and I've been a blockchain developer for 2+ years.",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
  {
    id: 2,
    channel: "1",
    account: "0x1b3cB81E51011b549d78bf720b0d924ac763A7C2",
    text: "Hello everyone!",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
  {
    id: 3,
    channel: "2",
    account: "0x1b3cB81E51011b549d78bf720b0d924ac763A7C2",
    text: "Hey there! My name is Ann and I'm an aspiring blockchain developer!",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
  {
    id: 4,
    channel: "1",
    account: "0x701C484bfb40ac628aFA487b6082f084B14AF0BD",
    text: "Hey everyone!",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
  {
    id: 5,
    channel: "1",
    account: "0x189B9cBd4AfF470aF2C0102f365FC1823d857965",
    text: "Hey there, great to be here!",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
  {
    id: 6,
    channel: "1",
    account: "0x176F3DAb24a159341c0509bB36B833E7fdd0a132",
    text: "Hope everyone is having a good day ;)",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
  {
    id: 7,
    channel: "1",
    account: "0x828103B231B39ffFCe028562412B3c04A4640e64",
    text: "Hello!",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
  {
    id: 8,
    channel: "1",
    account: "0x176F3DAb24a159341c0509bB36B833E7fdd0a132",
    text: "Does anyone have any tips on becoming a blockchain developer?",
    timestamp: new Date,
    messageTimestampTokenAmount: 1* (10**18),
    reactions: {},
    replyId: null
  },
]

import { Server } from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('get messages', () => {
    io.emit('get messages', messages)
  })

  socket.on('new message', (msg) => {
    messages.push(msg)
    io.emit('new message', messages)
  })

  socket.on('update reactions', ({ messageId, reactions }) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      console.log(message)
      message.reactions = reactions;
      io.emit('message update', message);
    }
  });

  // Handle deleting a message
  socket.on('delete message', ({ id }) => {
    messages = messages.filter(msg => msg.id !== id);
    
    // Broadcast the updated list to all clients
    io.emit('get messages', messages);  
  });

  // Handle delete messages by author for blacklist menu
  socket.on('delete messages by author', ({ user }) => {
    if (!user) {
      console.error("User ID is required to delete messages by author.");
      return;
    }
    // filter out all messages where the user is the author
    messages = messages.filter(msg => msg.account !== user);
    
    // Broadcast the updated list to all clients
    io.emit('get messages', messages);  
  });

socket.on('disconnect', () => {
  console.log('A user disconnected');
});

})