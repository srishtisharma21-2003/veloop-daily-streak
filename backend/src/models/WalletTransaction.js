const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, default: 'VES' },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], default: 'CREDIT' },
  amount: { type: Number, required: true },
  source: { type: String, default: 'DAILY_STREAK' },
  referenceId: { type: String },
  streakDay: { type: Number },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
  createdAt: { type: Date, default: Date.now }
});

walletTransactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
