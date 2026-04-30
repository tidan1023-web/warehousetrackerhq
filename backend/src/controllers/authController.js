const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Company = require('../models/Company');
const { sendWelcome, sendPasswordReset } = require('../utils/email');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Every new registration creates its own isolated company workspace
  const company = await Company.create({ companyName: 'My Company' });
  const user = await User.create({ name, email, password, role: 'admin', companyId: company._id });
  company.createdBy = user._id;
  await company.save();

  const token = generateToken(user._id);
  sendWelcome(user).catch((e) => console.warn('Welcome email failed:', e.message));
  res.status(201).json({ message: 'Registration successful', token, user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'Account has been deactivated' });
  }

  const token = generateToken(user._id);
  res.json({ message: 'Login successful', token, user });
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

const googleAuth = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'Google credential required' });

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload();

  let user = await User.findOne({ email });
  if (!user) {
    const company = await Company.create({ companyName: 'My Company' });
    const randomPw = Math.random().toString(36) + Math.random().toString(36);
    user = await User.create({ name, email, password: randomPw, role: 'admin', companyId: company._id, avatar: picture });
    company.createdBy = user._id;
    await company.save();
  }

  if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });

  const token = generateToken(user._id);
  res.json({ message: 'Google login successful', token, user });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  // Always respond the same way so we don't reveal whether an email exists
  if (!user) return res.json({ message: 'If that email is registered, a reset link has been sent.' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL || 'https://pico-bello-boq.onrender.com'}/reset-password/${token}`;
  await sendPasswordReset(user, resetUrl);

  res.json({ message: 'If that email is registered, a reset link has been sent.' });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired.' });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful. You can now log in.' });
};

module.exports = { register, login, getMe, googleAuth, forgotPassword, resetPassword };
