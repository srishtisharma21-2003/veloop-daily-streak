const mongoose = require('mongoose');

const streakRewardSchema = new mongoose.Schema({
  day: { type: Number, required: true, unique: true, min: 1, max: 7 },
  rewardType: { type: String, enum: ['VES', 'AMAZON_GIFT_CARD'], required: true },
  currency: { type: String, default: 'VES' },
  amount: { type: Number, default: 0 },
  title: { type: String, required: true },
  subtitle: { type: String },
  assetType: { type: String, enum: ['coin', 'gift-card', 'crown', 'gift'], default: 'coin' },
  active: { type: Boolean, default: true },
  metadata: { type: Object, default: {} }
});

module.exports = mongoose.model('StreakReward', streakRewardSchema);
