require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// 1. CRITICAL MIDDLEWARE
// ======================

// Enhanced CORS Configuration
const allowedOrigins = [
  'https://smart-waste-management-rust.vercel.app',
  'https://smart-waste-management-eob6.vercel.app',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
}));

// Body Parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ======================
// 2. DATABASE VERIFICATION
// ======================

const verifyDatabase = async () => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ Database connection verified');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    return false;
  }
};

// Database Health Middleware
app.use(async (req, res, next) => {
  if (await verifyDatabase()) {
    next();
  } else {
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// ======================
// 3. ROUTES SETUP
// ======================

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// ======================
// 4. ERROR HANDLING
// ======================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    requestId: req.id
  });
});

// ======================
// 5. SOCKET.IO SETUP
// ======================

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 120000 // 2 minutes
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`💬 User joined chat: ${chatId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { chat_id, sender_id, content } = data;
      const [result] = await db.query(
        'INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)',
        [chat_id, sender_id, content]
      );
      
      const [message] = await db.query(
        `SELECT m.*, u.name as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.user_id
        WHERE m.message_id = ?`,
        [result.insertId]
      );
      
      io.to(chat_id).emit('receive_message', message[0]);
    } catch (error) {
      console.error('💥 Message handling error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ======================
// 6. SERVER STARTUP
// ======================

const startServer = async () => {
  try {
    // Verify database before starting
    if (!await verifyDatabase()) {
      throw new Error('Database connection failed');
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
      console.log(`🛡️ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('⛔ Failed to start server:', err);
    process.exit(1);
  }
};

// Handle process events
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught exception:', err);
  process.exit(1);
});

// Start the server
startServer();
