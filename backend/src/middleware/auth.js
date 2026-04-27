'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const user = await User.findById(decoded.id).select('+password');
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Account not found or deactivated' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

function generateTokens(user) {
  const payload = {
    id: user._id.toString(),
    role: user.role,
    employeeId: user.employeeId,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });

  const refreshToken = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
}

module.exports = { authenticate, generateTokens };
