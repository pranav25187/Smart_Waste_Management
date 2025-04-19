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
// 1. Enhanced Middleware Configuration
// ======================

const allowedOrigins = [
  'https://smart-waste-management-rust.vercel.app',
  'https://smart-waste-management-eob6.vercel.app',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000'
].filter(Boolean);

// Security and CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
}));

// Body parsing with limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ======================
// 2. Database Health Check
// ======================

const checkDatabaseHealth = async () => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
};

// Database health middleware
app.use(async (req, res, next) => {
  if (await checkDatabaseHealth()) {
    next();
  } else {
    res.status(503).json({ 
      status: 'error',
      message: 'Database service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// ======================
// 3. API Routes Configuration
// ======================

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
const apiRoutes = express.Router();
apiRoutes.use('/auth', require('./routes/authRoutes'));
apiRoutes.use('/posts', require('./routes/postRoutes'));
apiRoutes.use('/transactions', require('./routes/transactionRoutes'));
apiRoutes.use('/contact', require('./routes/contactRoutes'));
apiRoutes.use('/chats', require('./routes/chatRoutes'));

// Health check endpoint
apiRoutes.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// ======================
// 4. Error Handling
// ======================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  
  const statusCode = err.status || 500;
  const response = {
    status: 'error',
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

// ======================
// 5. Socket.IO Configuration
// ======================

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 120000
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join_chat', async (chatId) => {
    try {
      socket.join(chatId);
      console.log(`User joined chat ${chatId}`);
      
      // Update last seen when joining
      await db.query(
        'UPDATE chats SET last_accessed = NOW() WHERE chat_id = ?',
        [chatId]
      );
    } catch (err) {
      console.error('Chat join error:', err);
    }
  });

  socket.on('send_message', async (messageData) => {
    try {
      const { chat_id, sender_id, content } = messageData;
      
      // Save to database
      const [result] = await db.query(
        'INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)',
        [chat_id, sender_id, content]
      );

      // Update chat timestamp
      await db.query(
        'UPDATE chats SET updated_at = NOW() WHERE chat_id = ?',
        [chat_id]
      );

      // Get complete message with sender info
      const [message] = await db.query(`
        SELECT m.*, u.name as sender_name 
        FROM messages m
        JOIN users u ON m.sender_id = u.user_id
        WHERE m.message_id = ?
      `, [result.insertId]);

      // Broadcast to room
      io.to(chat_id).emit('receive_message', message[0]);
    } catch (err) {
      console.error('Message handling error:', err);
      socket.emit('message_error', {
        error: 'Failed to send message',
        details: err.message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ======================
// 6. Server Startup
// ======================

const startServer = async () => {
  try {
    // Verify database connection first
    if (!await checkDatabaseHealth()) {
      throw new Error('Failed to connect to database');
    }

    server.listen(PORT, () => {
      console.log(`
        🚀 Server successfully started
        ⚡ Port: ${PORT}
        🌐 Environment: ${process.env.NODE_ENV || 'development'}
        🛡️ Allowed Origins: ${allowedOrigins.join(', ')}
        📅 ${new Date().toLocaleString()}
      `);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

// Process event handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
});

// Start the server
startServer();
