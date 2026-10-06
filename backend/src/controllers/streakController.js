const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const StreakClaim = require('../models/StreakClaim');
const { getStreakStatus, getOrCreateCycle } = require('../services/streak.service');
const { getRewardByDay } = require('../services/reward.service');
const { creditWallet, getWalletBalance } = require('../services/wallet.service');
const auditService = require('../services/audit.service');
const { AUDIT_ACTIONS, TOTAL_STREAK_DAYS } = require('../utils/constants');

exports.getStreak = async (req, res, next) => {
  try {
    const status = await getStreakStatus(req.user.id);
    res.json({ success: true, ...status });
  } catch (err) {
    next(err);
  }
};

exports.getStatus = exports.getStreak;

exports.claimReward = async (req, res, next) => {
  const session = await mongoose.startSession();
  let result = null;

  try {
    await session.withTransaction(async () => {
      const userId = req.user.id;
      await auditService.log(AUDIT_ACTIONS.CLAIM_REQUEST, userId, {}, req.ip);
      const cycle = await getOrCreateCycle(userId, session);

      if (cycle.currentDay > 1) {
        const prev = await StreakClaim.findOne({
          userId,
          cycleId: cycle._id,
          day: cycle.currentDay - 1
        }).session(session);

        if (!prev) {
          throw Object.assign(new Error('Previous day not claimed. Complete Day ' + (cycle.currentDay - 1) + ' first.'), {
            statusCode: 400
          });
        }
      }

      const exists = await StreakClaim.findOne({
        userId,
        cycleId: cycle._id,
        day: cycle.currentDay
      }).session(session);
      if (exists) throw Object.assign(new Error('Already claimed.'), { statusCode: 409 });

      if (cycle.nextClaimAt && Date.now() < cycle.nextClaimAt.getTime()) {
        throw Object.assign(new Error('Not available yet.'), {
          statusCode: 400,
          nextClaimAt: cycle.nextClaimAt
        });
      }

      const reward = await getRewardByDay(cycle.currentDay);
      if (!reward) throw Object.assign(new Error('Reward config missing.'), { statusCode: 500 });

      let transactionId;
      if (reward.rewardType === 'VES') {
        const walletInfo = await creditWallet({
          userId,
          amount: reward.amount,
          currency: reward.currency || 'VES',
          streakDay: cycle.currentDay,
          session
        });
        transactionId = walletInfo.transactionId;
      } else {
        transactionId = `GC-${uuidv4().slice(0, 10).toUpperCase()}`;
      }

      const claimId = `CLM-${uuidv4().slice(0, 10).toUpperCase()}`;
      await StreakClaim.create([{
        claimId,
        userId,
        cycleId: cycle._id,
        day: cycle.currentDay,
        rewardId: reward._id,
        status: 'CLAIMED',
        transactionId,
        claimedAt: new Date()
      }], { session });

      const claimedDay = cycle.currentDay;
      cycle.lastClaimedAt = new Date();
      cycle.currentDay = claimedDay + 1;
      cycle.nextClaimAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (cycle.currentDay > TOTAL_STREAK_DAYS) {
        cycle.status = 'COMPLETED';
        cycle.completedAt = new Date();
      }

      await cycle.save({ session });
      await auditService.log(AUDIT_ACTIONS.CLAIM_SUCCESS, userId, {
        day: claimedDay,
        rewardType: reward.rewardType,
        amount: reward.amount
      }, req.ip);

      result = { claimedDay, transactionId, reward };
    });

    const fresh = await getStreakStatus(req.user.id);
    const wallet = await getWalletBalance(req.user.id);
    res.json({
      success: true,
      message: 'Reward claimed!',
      claimedDay: result.claimedDay,
      transactionId: result.transactionId,
      reward: {
        type: result.reward.rewardType,
        amount: result.reward.amount,
        currency: result.reward.currency
      },
      wallet,
      streak: fresh
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Already claimed.' });
    }
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(err.nextClaimAt ? { nextClaimAt: err.nextClaimAt } : {})
      });
    }
    next(err);
  } finally {
    session.endSession();
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const claims = await StreakClaim.find({ userId: req.user.id })
      .populate('rewardId')
      .sort({ claimedAt: -1 })
      .lean();
    res.json({ success: true, history: claims });
  } catch (err) {
    next(err);
  }
};
