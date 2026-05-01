require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { Server } = require('socket.io');

const { sequelize, Skill } = require('./models');
const socketHandler = require('./socket/socketHandler');
const seedSkills = require('./utils/seedSkills');

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || true, // Allow frontend origin or all for local dev
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});
socketHandler(io);

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || true, // Allow frontend origin or all for local dev
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes placeholder
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/swaps', require('./routes/swaps'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/notifications', require('./routes/notifications'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    code: err.code || 'SERVER_ERROR'
  });
});

const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Sync DB and Start Server
sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(async () => {
    console.log('Database synced successfully.');
    // Seed skills if empty
    const count = await Skill.count();
    if (count === 0) {
      await seedSkills();
    }
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
