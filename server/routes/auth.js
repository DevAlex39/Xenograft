const router   = require('express').Router();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const { pool } = require('../config/db');

function makeToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function safeUser(u) {
  return { id: u.id, username: u.username, email: u.email, role: u.role };
}

// ─── Inscription ─────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Champs requis manquants' });
  if (password.length < 6) return res.status(400).json({ error: 'Mot de passe trop court (6 caractères min)' });

  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE username=? OR email=?', [username, email]);
    if (exists.length) return res.status(409).json({ error: 'Nom d\'utilisateur ou email déjà utilisé' });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?,?,?)',
      [username, email, hash]
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [result.insertId]);
    res.status(201).json({ token: makeToken(rows[0]), user: safeUser(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Connexion ───────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { login, password } = req.body; // login = username ou email
  if (!login || !password) return res.status(400).json({ error: 'Champs requis manquants' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username=? OR email=?', [login, login]);
    if (!rows.length) return res.status(401).json({ error: 'Identifiants incorrects' });
    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Identifiants incorrects' });

    await pool.query('UPDATE users SET last_login=NOW() WHERE id=?', [user.id]);
    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Me (vérif token) ────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Non authentifié' });
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [decoded.id]);
    if (!rows.length) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json({ user: safeUser(rows[0]) });
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
});

module.exports = router;
