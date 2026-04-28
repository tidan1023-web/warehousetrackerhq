'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { EmployeeComment } = require('../models/EmployeeComment');
const { AuditLog } = require('../models/AuditLog');
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
    user.loginCount = (user.loginCount || 0) + 1;
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
        department: user.department,
        about: user.about,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) throw createError('Refresh token required', 400);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw createError('Invalid or expired refresh token', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) throw createError('User not found or deactivated', 401);

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
    department: u.department,
    about: u.about,
    profilePicture: u.profilePicture,
    performanceRating: u.performanceRating,
    loginCount: u.loginCount,
  });
}

async function updateProfile(req, res, next) {
  try {
    const { name, department, about } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (department !== undefined) update.department = department.trim();
    if (about !== undefined) update.about = about.trim();

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({
      id: user._id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      about: user.about,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const valid = await user.comparePassword(currentPassword);
    if (!valid) throw createError('Current password is incorrect', 400);
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
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

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) throw createError('User not found', 404);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function getUserStats(req, res, next) {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      throw createError('Forbidden', 403);
    }

    const [dispatches, verifications, defects, images, products, logins, recentActivity] =
      await Promise.all([
        AuditLog.countDocuments({ userId: id, action: 'PRODUCT_DISPATCHED' }),
        AuditLog.countDocuments({ userId: id, action: 'PRODUCT_VERIFIED' }),
        AuditLog.countDocuments({ userId: id, action: 'DEFECT_LOGGED' }),
        AuditLog.countDocuments({ userId: id, action: 'IMAGE_UPLOADED' }),
        AuditLog.countDocuments({ userId: id, action: 'PRODUCT_CREATED' }),
        AuditLog.countDocuments({ userId: id, action: 'USER_LOGIN' }),
        AuditLog.find({ userId: id }).sort({ timestamp: -1 }).limit(10).lean(),
      ]);

    const user = await User.findById(id).lean();

    res.json({
      stats: { dispatches, verifications, defects, images, products, logins },
      recentActivity,
      performanceRating: user?.performanceRating || 0,
      loginCount: user?.loginCount || 0,
    });
  } catch (err) {
    next(err);
  }
}

async function updatePerformanceRating(req, res, next) {
  try {
    const { rating } = req.body;
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      throw createError('Rating must be 0–5', 400);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { performanceRating: rating },
      { new: true }
    );
    if (!user) throw createError('User not found', 404);
    res.json({ performanceRating: user.performanceRating });
  } catch (err) {
    next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const { comment, mentionedEmployeeIds } = req.body;
    if (!comment?.trim()) throw createError('Comment is required', 400);
    const target = await User.findById(req.params.id);
    if (!target) throw createError('User not found', 404);

    const doc = await EmployeeComment.create({
      targetUserId: req.params.id,
      authorId: req.user._id,
      authorName: req.user.name,
      authorEmployeeId: req.user.employeeId,
      comment: comment.trim(),
      mentionedEmployeeIds: mentionedEmployeeIds || [],
    });
    res.status(201).json({ comment: doc });
  } catch (err) {
    next(err);
  }
}

async function getComments(req, res, next) {
  try {
    const comments = await EmployeeComment.find({ targetUserId: req.params.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ comments });
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

module.exports = {
  login,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  createUser,
  listUsers,
  getUserById,
  getUserStats,
  updatePerformanceRating,
  addComment,
  getComments,
  deactivateUser,
};
