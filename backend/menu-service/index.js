import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_PORT = Number(process.env.SERVICE_PORT || 8082);

// --- helpers ---
async function initDb() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.csv'.replace('.csv', '.sql')), 'utf8');
  await pool.query(sql);
  console.log('[initdb] schema ensured');
}

async function gracefulShutdown() {
  await pool.end().catch(() => {});
  process.exit(0);
}

// Express app
const app = express();
app.use(express.json());

// Basic CORS for local/dev; in prod we sit behind Ingress/CF
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health
app.get('/healthz', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// List menu by restaurant slug
app.get('/menu/:restaurant_slug', async (req, res) => {
  const { restaurant_slug } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT id, restaurant_slug, name, description, price_paise, image_key, is_available, created_at, updated_at
       FROM menu_items WHERE restaurant_slug = $1 ORDER BY id ASC`,
      [restaurant_slug]
    );
    res.json(rows); // flat style
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_fetch_menu' });
  }
});

// Create menu item for a restaurant
app.post('/menu/:restaurant_slug', async (req, res) => {
  const { restaurant_slug } = req.params;
  const { name, description, price_paise, image_key, is_available = true } = req.body || {};
  if (!name || typeof price_paise !== 'number' || !image_key) {
    return res.status(400).json({ error: 'invalid_payload', required: ['name', 'price_paise', 'image_key'] });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO menu_items (restaurant_slug, name, description, price_paise, image_key, is_available)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, restaurant_slug, name, description, price_paise, image_key, is_available`,
      [restaurant_slug, name, description || null, Math.max(0, Math.floor(price_paise)), image_key, !!is_available]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    if (e.code === '23503') {
      return res.status(400).json({ error: 'unknown_restaurant_slug' });
    }
    res.status(500).json({ error: 'insert_failed' });
  }
});

// Update a menu item
app.put('/menu/item/:id', async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};
  const fields = [];
  const values = [];
  let i = 1;

  const updatable = ['name', 'description', 'price_paise', 'image_key', 'is_available'];
  for (const key of updatable) {
    if (payload[key] !== undefined) {
      fields.push(`${key} = $${i++}`);
      values.push(key === 'price_paise' ? Math.max(0, Math.floor(payload[key])) : payload[key]);
    }
  }
  if (fields.length === 0) return res.status(400).json({ error: 'nothing_to_update' });

  values.push(Number(id));
  try {
    const { rows } = await
      pool.query(`UPDATE menu_items SET ${fields.join(', ')}, updated_at = now() WHERE id = $${i} RETURNING *`, values);
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'update_failed' });
  }
});

// Delete a menu item
app.delete('/menu/item/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(`DELETE FROM menu_items WHERE id = $1`, [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'not_found' });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'delete_failed' });
  }
});

// Seeder (dev convenience): load from seeds/<slug>.json
async function seedOne(slug) {
  const file = path.join(__dirname, 'seeds', `${slug}.json`);
  if (!fs.existsSync(file)) {
    console.error(`[seed] No file: ${file}`);
    return;
  }
  const items = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const it of items) {
    await pool.query(
      `INSERT INTO menu_items (restaurant_slug, name, description, price_paise, image_key, is_available)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT DO NOTHING`,
      [slug, it.name, it.description || null, it.price_paise, it.image_key, it.is_available ?? true]
    );
  }
  console.log(`[seed] inserted for ${slug}: ${items.length}`);
}

async function seedAll() {
  const files = fs.readdirSync(path.join(__dirname, 'seeds')).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const slug = f.replace('.json', '');
    await seedOne(slug);
  }
}

// CLI helpers
if (process.argv.includes('--initdb')) {
  initDb()
    .then(() => gracefulShutdown())
    .catch(err => { console.error(err); process.exit(1); });
} else if (process.argv.includes('--seed')) {
  const idx = process.argv.indexOf('--seed');
  const which = process.argv[idx + 1];
  (async () => {
    await initDb();
    if (which === 'all') await seedAll();
    else await seedOne(which);
    await gracefulShutdown();
  })().catch(e => { console.error(e); process.exit(1); });
} else {
  // start server
  initDb().then(() => {
    app.listen(SERVICE_PORT, () => {
      console.log(`menu-service listening on :${SERVICE_PORT}`);
    });
  }).catch(err => {
    console.error('Failed to init DB', err);
    process.exit(1);
  });

  // handle signals
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}
