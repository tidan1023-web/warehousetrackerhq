'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { generateTokens } = require('../middleware/auth');
const { createAuditLog } = require('../utils/auditLogger');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      logger.warn('Failed login attempt', { email, ip: req.ip });
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.lastLogin = new Date();
    await user.save();

    await createAuditLog({
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user._id,
      user,
      details: { email: user.email },
      req,
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      throw createError('Refresh token required', 400);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw createError('Invalid or expired refresh token', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw createError('User not found or deactivated', 401);
    }

    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res) {
  const u = req.user;
  res.json({
    id: u._id,
    employeeId: u.employeeId,
    name: u.name,
    email: u.email,
    role: u.role,
    lastLogin: u.lastLogin,
  });
}

async function createUser(req, res, next) {
  try {
    const { employeeId, name, email, password, role } = req.body;
    const user = await User.create({ employeeId, name, email, password, role });

    await createAuditLog({
      action: 'USER_CREATED',
      entityType: 'user',
      entityId: user._id,
      user: req.user,
      details: { createdEmployeeId: employeeId, createdEmail: email, role },
      req,
    });

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

async function deactivateUser(req, res, next) {
  try {
    const { id } = req.params;
    const target = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!target) throw createError('User not found', 404);

    await createAuditLog({
      action: 'USER_DEACTIVATED',
      entityType: 'user',
      entityId: target._id,
      user: req.user,
      details: { deactivatedEmail: target.email },
      req,
    });

    res.json({ message: 'User deactivated', user: target });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, refreshToken, getMe, createUser, listUsers, deactivateUser };
