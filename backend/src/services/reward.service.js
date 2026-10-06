const StreakReward = require('../models/StreakReward');

const getActiveRewards = () => StreakReward.find({ active: true }).sort({ day: 1 }).lean();
const getRewardByDay = (day) => StreakReward.findOne({ day, active: true }).lean();

module.exports = { getActiveRewards, getRewardByDay };
