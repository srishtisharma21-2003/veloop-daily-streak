const AuditLog = require('../models/AuditLog');

async function log(action, userId, details = {}, ip = null) {
  try {
    await AuditLog.create({ action, userId, details, ip });
  } catch (err) {
    console.error('Audit failed:', err.message);
  }
}

module.exports = { log };
