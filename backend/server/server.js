require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const contactRoutes = require('./routes/contactRoutes');
// In your server.js or routes file
const chatRoutes = require('./routes/chatRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://your-frontend-app.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chats', chatRoutes);
// DB Connection Test
db.getConnection()
  .then(connection => {
    console.log('MySQL Connected...');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      const { chat_id, sender_id, content } = data;

      // Save message to DB
      const [result] = await db.query(
        `INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)`,
        [chat_id, sender_id, content]
      );

      // Update chat timestamp
      await db.query(
        `UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?`,
        [chat_id]
      );

      // Fetch full message with sender info
      const [message] = await db.query(
        `SELECT m.*, u.name as sender_name 
         FROM messages m
         JOIN users u ON m.sender_id = u.user_id
         WHERE m.message_id = ?`,
        [result.insertId]
      );

      // Emit message to room
      io.to(chat_id).emit('receive_message', message[0]);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ✅ Start server (Only this one, not app.listen!)
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
