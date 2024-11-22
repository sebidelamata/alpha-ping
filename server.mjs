import express from 'express'
const app = express()
import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose';
import { Server } from 'socket.io';


mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(error => console.error('Error connecting to MongoDB:', error));

const messageSchema = new mongoose.Schema({
  channel: String,
  account: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  messageTimestampTokenAmount: Number,
  reactions: {
    type: Map, // Use Map for flexibility with key-value pairs
    of: [String], // Each key (reaction type) maps to an array of accounts/usernames
    default: {},
  },
  replyId: {
    type: mongoose.Schema.Types.ObjectId, // Reference another message document if it's a reply
    ref: 'Message',
    default: null,
  },
});

const Message = mongoose.model('Message', messageSchema);

const PORT = process.env.NEXT_PUBLIC_PORT || 3030
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}\n`))

const allowedOrigins = [
  "https://www.alphaping.xyz",
  "https://www.alphaping.xyz/app"
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log('a user connected')

   // Fetch and emit existing messages from MongoDB when a client connects
   Message.find()
   .sort({ timestamp: 1 }) // Sort by timestamp if needed
   .then(messages => {
     socket.emit('get messages', messages);
   })
   .catch(error => console.error('Error fetching messages:', error));

  // Save new messages to MongoDB and broadcast to clients
  socket.on('new message', async (msg) => {
    const message = new Message(msg);
    try {
      await message.save();
      io.emit('new message', await Message.find().sort({ timestamp: 1 })); // Emit updated message list
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Update reactions for a message
  socket.on('update reactions', async ({ messageId, reactions }) => {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { reactions },
        { new: true }
      );
      io.emit('message update', message);
    } catch (error) {
      console.error('Error updating reactions:', error);
    }
  });

  // Delete a specific message
  socket.on('delete message', async ({ id }) => {
    try {
      await Message.findByIdAndDelete(id);
      io.emit('get messages', await Message.find().sort({ timestamp: 1 })); // Emit updated message list
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  });

   // Delete messages by author
   socket.on('delete messages by author', async ({ user }) => {
    if (!user) {
      console.error("User ID is required to delete messages by author.");
      return;
    }
    try {
      await Message.deleteMany({ account: user });
      io.emit('get messages', await Message.find().sort({ timestamp: 1 })); // Emit updated message list
    } catch (error) {
      console.error('Error deleting messages by author:', error);
    }
  });

socket.on('disconnect', () => {
  console.log('A user disconnected');
});

})