require('dotenv').config();
const connectDB = require('../config/db');
const StreakReward = require('../models/StreakReward');

const rewards = [
  { day: 1, rewardType: 'VES', amount: 5, currency: 'VES', title: 'Daily Reward', subtitle: '5 VEs', assetType: 'coin' },
  { day: 2, rewardType: 'VES', amount: 10, currency: 'VES', title: 'Daily Reward', subtitle: '10 VEs', assetType: 'coin' },
  { day: 3, rewardType: 'VES', amount: 15, currency: 'VES', title: 'Daily Reward', subtitle: '15 VEs', assetType: 'coin' },
  { day: 4, rewardType: 'AMAZON_GIFT_CARD', amount: 1, currency: 'INR', title: 'Daily Reward', subtitle: '1 Amazon Gift Card', assetType: 'gift' },
  { day: 5, rewardType: 'AMAZON_GIFT_CARD', amount: 2, currency: 'INR', title: 'Daily Reward', subtitle: '2 Amazon Gift Card', assetType: 'gift-card' },
  { day: 6, rewardType: 'VES', amount: 30, currency: 'VES', title: 'Daily Reward', subtitle: '30 VEs', assetType: 'coin' },
  { day: 7, rewardType: 'AMAZON_GIFT_CARD', amount: 5, currency: 'INR', title: 'Ultimate Reward', subtitle: '5 Amazon Gift Card', assetType: 'crown' }
];

(async () => {
  try {
    await connectDB();
    await StreakReward.deleteMany({});
    await StreakReward.insertMany(rewards);
    console.log('✅ 7 streak rewards seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();
