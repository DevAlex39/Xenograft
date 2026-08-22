require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const { pool, testConnection } = require('./config/db');
const { migrate }              = require('./config/migrate');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/runs', require('./routes/runs'));

app.get('/api/health', (_, res) => res.json({ ok: true, ts: Date.now() }));

const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  console.log(`\n🚀 Serveur XENOGRAFT démarré sur http://localhost:${PORT}`);
  await testConnection();
  await migrate();
});
