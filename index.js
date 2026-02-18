const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const memberSchema = require('./validation');

const app = express();
app.use(bodyParser.json());

// Helper: build filter query
function buildFilterQuery(query) {
  const filters = [];
  const params = [];
  if (query.country) {
    filters.push('country = ?');
    params.push(query.country);
  }
  if (query.membership_tier) {
    filters.push('membership_tier = ?');
    params.push(query.membership_tier);
  }
  if (query.status) {
    filters.push('status = ?');
    params.push(query.status);
  }
  return { where: filters.length ? 'WHERE ' + filters.join(' AND ') : '', params };
}

// CRUD: Create
app.post('/api/members', (req, res) => {
  const { error, value } = memberSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { full_name, email, country, membership_tier, status, joined_date, expiry_date } = value;
  const sql = `INSERT INTO members (full_name, email, country, membership_tier, status, joined_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [full_name, email, country, membership_tier, status, joined_date, expiry_date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, ...value });
  });
});

// CRUD: Read (list with filters)
app.get('/api/members', (req, res) => {
  const { where, params } = buildFilterQuery(req.query);
  db.all(`SELECT * FROM members ${where}`, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Statistics endpoint
app.get('/api/members/stats', (req, res) => {
  db.all('SELECT country, membership_tier, status, COUNT(*) as count FROM members GROUP BY country, membership_tier, status', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CRUD: Read (single)
app.get('/api/members/:id', (req, res) => {
  db.get('SELECT * FROM members WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Member not found' });
    res.json(row);
  });
});

// CRUD: Update
app.put('/api/members/:id', (req, res) => {
  const { error, value } = memberSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { full_name, email, country, membership_tier, status, joined_date, expiry_date } = value;
  const sql = `UPDATE members SET full_name=?, email=?, country=?, membership_tier=?, status=?, joined_date=?, expiry_date=? WHERE id=?`;
  db.run(sql, [full_name, email, country, membership_tier, status, joined_date, expiry_date, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Member not found' });
    res.json({ id: req.params.id, ...value });
  });
});

// CRUD: Delete
app.delete('/api/members/:id', (req, res) => {
  db.run('DELETE FROM members WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Member not found' });
    res.json({ success: true });
  });
});



// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
