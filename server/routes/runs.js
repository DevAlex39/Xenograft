const router = require('express').Router();
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { MAX_RUN_SLOTS } = require('../config/migrate');

// ─── Liste des runs du compte (jusqu'à MAX_RUN_SLOTS) ────────────────────────
router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, slot, name, status, world, created_at, updated_at FROM runs WHERE user_id=? ORDER BY slot',
    [req.user.id]
  );
  res.json({ runs: rows, maxSlots: MAX_RUN_SLOTS });
});

// ─── Détail d'une run (état complet, pour reprendre la partie) ───────────────
router.get('/:id', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM runs WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  if (!rows.length) return res.status(404).json({ error: 'Run introuvable' });
  res.json({ run: rows[0] });
});

// ─── Créer une nouvelle run dans le premier slot libre ───────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { name } = req.body;
  const [used] = await pool.query('SELECT slot FROM runs WHERE user_id=?', [req.user.id]);
  const usedSlots = new Set(used.map(r => r.slot));

  let slot = null;
  for (let i = 1; i <= MAX_RUN_SLOTS; i++) {
    if (!usedSlots.has(i)) { slot = i; break; }
  }
  if (slot === null) return res.status(409).json({ error: `Nombre maximum de runs atteint (${MAX_RUN_SLOTS})` });

  const initialState = { floor: 1, world: 'foret', body: {}, mutations: [], fragments: 0 };
  const [result] = await pool.query(
    'INSERT INTO runs (user_id, slot, name, state) VALUES (?,?,?,?)',
    [req.user.id, slot, (name || `Run ${slot}`).slice(0, 50), JSON.stringify(initialState)]
  );
  const [rows] = await pool.query('SELECT * FROM runs WHERE id=?', [result.insertId]);
  res.status(201).json({ run: rows[0] });
});

// ─── Sauvegarder l'état d'une run (appelé régulièrement pendant la partie) ────
router.put('/:id', requireAuth, async (req, res) => {
  const { state, status } = req.body;
  const [rows] = await pool.query('SELECT id FROM runs WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  if (!rows.length) return res.status(404).json({ error: 'Run introuvable' });

  const fields = [];
  const values = [];
  if (state !== undefined) { fields.push('state=?'); values.push(JSON.stringify(state)); }
  if (status !== undefined) { fields.push('status=?'); values.push(status); }
  if (!fields.length) return res.status(400).json({ error: 'Rien à mettre à jour' });

  values.push(req.params.id);
  await pool.query(`UPDATE runs SET ${fields.join(', ')} WHERE id=?`, values);
  res.json({ ok: true });
});

// ─── Libérer un slot (abandon de run) ─────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  const [result] = await pool.query('DELETE FROM runs WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Run introuvable' });
  res.json({ ok: true });
});

module.exports = router;
