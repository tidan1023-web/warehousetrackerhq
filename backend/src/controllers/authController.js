const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Company = require('../models/Company');

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

module.exports = { register, login, getMe, googleAuth };
