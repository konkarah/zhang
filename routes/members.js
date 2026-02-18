const express = require('express');
const router = express.Router();
const memberSchema = require('../models/memberValidation');
const memberService = require('../service/memberService');

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
router.post('/', (req, res) => {
  const { error, value } = memberSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  memberService.createMember(value, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, ...value });
  });
});

// CRUD: Read (list with filters)
router.get('/', (req, res) => {
  const { where, params } = buildFilterQuery(req.query);
  memberService.getMembers(where, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CRUD: Read (single)
router.get('/:id', (req, res) => {
  memberService.getMemberById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Member not found' });
    res.json(row);
  });
});

// CRUD: Update
router.put('/:id', (req, res) => {
  const { error, value } = memberSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  memberService.updateMember(req.params.id, value, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: 'Member not found' });
    res.json({ id: req.params.id, ...value });
  });
});

// CRUD: Delete
router.delete('/:id', (req, res) => {
  memberService.deleteMember(req.params.id, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: 'Member not found' });
    res.json({ success: true });
  });
});

// Statistics endpoint
router.get('/stats', (req, res) => {
  memberService.getStats((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
