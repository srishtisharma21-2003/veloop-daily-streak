const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const claimLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });
module.exports = { apiLimiter, claimLimiter };
