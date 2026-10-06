module.exports = (err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Already claimed.' });
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid request.' });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Unable to process. Try again.'
  });
};
