const mongoose = require('mongoose');

const streakClaimSchema = new mongoose.Schema({
  claimId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cycleId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreakCycle', required: true },
  day: { type: Number, required: true },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreakReward', required: true },
  status: { type: String, enum: ['CLAIMED'], default: 'CLAIMED' },
  claimedAt: { type: Date, default: Date.now },
  transactionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// CRITICAL: This unique index prevents duplicate claims from concurrent requests
streakClaimSchema.index({ userId: 1, cycleId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('StreakClaim', streakClaimSchema);
