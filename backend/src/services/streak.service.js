const StreakCycle = require('../models/StreakCycle');
const StreakClaim = require('../models/StreakClaim');
const { getActiveRewards } = require('./reward.service');
const { MISS_WINDOW_HOURS, TOTAL_STREAK_DAYS } = require('../utils/constants');

async function getOrCreateCycle(userId, session = null) {
  const query = StreakCycle.findOne({ userId, status: 'ACTIVE' });
  if (session) query.session(session);

  let cycle = await query;
  if (!cycle) {
    if (session) {
      const created = await StreakCycle.create([{ userId, cycleNumber: 1, currentDay: 1, status: 'ACTIVE' }], { session });
      cycle = created[0];
    } else {
      cycle = await StreakCycle.create({ userId, cycleNumber: 1, currentDay: 1, status: 'ACTIVE' });
    }
  }
  return cycle;
}

function isStreakMissed(cycle) {
  if (!cycle.lastClaimedAt || !cycle.nextClaimAt) return false;
  const hours = (Date.now() - cycle.nextClaimAt.getTime()) / (1000 * 60 * 60);
  return hours > MISS_WINDOW_HOURS;
}

async function resetStreak(userId, oldCycle, session = null) {
  oldCycle.status = 'RESET';
  oldCycle.completedAt = new Date();
  await oldCycle.save({ session });

  if (session) {
    const created = await StreakCycle.create([{
      userId,
      cycleNumber: oldCycle.cycleNumber + 1,
      currentDay: 1,
      status: 'ACTIVE'
    }], { session });
    return created[0];
  }

  return StreakCycle.create({
    userId,
    cycleNumber: oldCycle.cycleNumber + 1,
    currentDay: 1,
    status: 'ACTIVE'
  });
}

async function getStreakStatus(userId) {
  let cycle = await getOrCreateCycle(userId);
  let wasReset = false;

  if (isStreakMissed(cycle)) {
    cycle = await resetStreak(userId, cycle);
    wasReset = true;
  }

  const rewards = await getActiveRewards();
  const claims = await StreakClaim.find({ userId, cycleId: cycle._id }).lean();
  const claimedDays = claims.map((claim) => claim.day);
  const currentDay = cycle.currentDay;
  const checkedIn = claimedDays.length;

  const rewardsWithStatus = rewards.map((reward) => {
    let status = 'LOCKED';
    if (claimedDays.includes(reward.day)) status = 'CLAIMED';
    else if (reward.day === currentDay) status = 'AVAILABLE';
    else if (reward.day < currentDay) status = 'MISSED';

    return {
      day: reward.day,
      status,
      reward: {
        type: reward.rewardType,
        currency: reward.currency,
        amount: reward.amount,
        title: reward.title,
        subtitle: reward.subtitle,
        assetType: reward.assetType
      },
      nextClaimAt: reward.day === currentDay ? cycle.nextClaimAt : null
    };
  });

  const now = Date.now();
  const isClaimable = cycle.status === 'ACTIVE' &&
    currentDay <= TOTAL_STREAK_DAYS &&
    (!cycle.nextClaimAt || now >= cycle.nextClaimAt.getTime());

  return {
    currentStreak: checkedIn,
    currentDay,
    checkedIn,
    totalRewards: rewards.length,
    status: cycle.status,
    nextClaimAt: cycle.nextClaimAt,
    serverTime: new Date().toISOString(),
    isClaimable,
    wasReset,
    cycleNumber: cycle.cycleNumber,
    rewards: rewardsWithStatus
  };
}

module.exports = { getOrCreateCycle, getStreakStatus, isStreakMissed, resetStreak };
