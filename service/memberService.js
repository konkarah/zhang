const db = require('../models/member');

const createMember = (member, callback) => {
  const { full_name, email, country, membership_tier, status, joined_date, expiry_date } = member;
  const sql = `INSERT INTO members (full_name, email, country, membership_tier, status, joined_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [full_name, email, country, membership_tier, status, joined_date, expiry_date], function(err) {
    callback(err, this ? this.lastID : null);
  });
};

const getMembers = (where, params, callback) => {
  db.all(`SELECT * FROM members ${where}`, params, callback);
};

const getMemberById = (id, callback) => {
  db.get('SELECT * FROM members WHERE id = ?', [id], callback);
};

const updateMember = (id, member, callback) => {
  const { full_name, email, country, membership_tier, status, joined_date, expiry_date } = member;
  const sql = `UPDATE members SET full_name=?, email=?, country=?, membership_tier=?, status=?, joined_date=?, expiry_date=? WHERE id=?`;
  db.run(sql, [full_name, email, country, membership_tier, status, joined_date, expiry_date, id], function(err) {
    callback(err, this ? this.changes : 0);
  });
};

const deleteMember = (id, callback) => {
  db.run('DELETE FROM members WHERE id = ?', [id], function(err) {
    callback(err, this ? this.changes : 0);
  });
};

const getStats = (callback) => {
  db.all('SELECT country, membership_tier, status, COUNT(*) as count FROM members GROUP BY country, membership_tier, status', [], callback);
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getStats
};
