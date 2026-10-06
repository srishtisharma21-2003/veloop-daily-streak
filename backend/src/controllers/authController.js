const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getOrCreateWallet } = require('../services/wallet.service');
const auditService = require('../services/audit.service');
const { AUDIT_ACTIONS, WELCOME_VES_BALANCE } = require('../utils/constants');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password too short.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const user = await User.create({ name, email, password });
    const wallet = await getOrCreateWallet(user._id);
    wallet.balance = WELCOME_VES_BALANCE;
    await wallet.save();

    await auditService.log(AUDIT_ACTIONS.USER_REGISTERED, user._id, { email }, req.ip);
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    await auditService.log(AUDIT_ACTIONS.USER_LOGIN, user._id, {}, req.ip);
    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};
