const mongoose = require('mongoose');

const streakCycleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cycleNumber: { type: Number, default: 1 },
  currentDay: { type: Number, default: 1, min: 1 },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'RESET'], default: 'ACTIVE' },
  lastClaimedAt: { type: Date, default: null },
  nextClaimAt: { type: Date, default: null },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

streakCycleSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('StreakCycle', streakCycleSchema);
