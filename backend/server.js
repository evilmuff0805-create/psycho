require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./database');
const todosRouter = require('./routes/todos');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
}));

app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/todos', todosRouter);

initDb()
  .then(() => {
    const host = '0.0.0.0';
    const port = process.env.PORT || 8080;
    app.listen(port, host, () => {
      console.log(`✅ Server running on ${host}:${port}`);
      console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'not set'}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
