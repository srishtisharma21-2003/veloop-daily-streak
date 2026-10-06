const { v4: uuidv4 } = require('uuid');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const { REWARD_SOURCE } = require('../utils/constants');

async function getOrCreateWallet(userId) {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) wallet = await Wallet.create({ userId, balance: 0, currency: 'VES' });
  return wallet;
}

async function creditWallet({ userId, amount, currency = 'VES', streakDay, session }) {
  const wallet = await Wallet.findOne({ userId }).session(session);
  if (!wallet) throw new Error('Wallet not found');

  const balanceBefore = wallet.balance;
  wallet.balance = balanceBefore + amount;
  wallet.updatedAt = new Date();
  await wallet.save({ session });

  const transactionId = `TXN-${uuidv4().slice(0, 10).toUpperCase()}`;
  const referenceId = `STREAK-${uuidv4().slice(0, 8).toUpperCase()}`;
  await WalletTransaction.create([{
    transactionId,
    userId,
    currency,
    type: 'CREDIT',
    amount,
    source: REWARD_SOURCE,
    referenceId,
    streakDay,
    balanceBefore,
    balanceAfter: wallet.balance,
    status: 'SUCCESS'
  }], { session });

  return { transactionId, referenceId, balanceBefore, balanceAfter: wallet.balance };
}

async function getWalletBalance(userId) {
  const wallet = await getOrCreateWallet(userId);
  return { balance: wallet.balance, currency: wallet.currency };
}

module.exports = { getOrCreateWallet, creditWallet, getWalletBalance };
