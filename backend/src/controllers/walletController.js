const { getWalletBalance } = require('../services/wallet.service');

exports.getWallet = async (req, res, next) => {
  try {
    const wallet = await getWalletBalance(req.user.id);
    res.json({ success: true, ...wallet });
  } catch (err) {
    next(err);
  }
};
