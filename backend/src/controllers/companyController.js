const Company = require('../models/Company');

const getCompany = async (req, res) => {
  const company = await Company.findOne().populate('updatedBy', 'name email');
  if (!company) {
    return res.status(404).json({ message: 'Company settings not configured yet' });
  }
  res.json({ company });
};

const upsertCompany = async (req, res) => {
  const data = { ...req.body, updatedBy: req.user._id, updatedAt: Date.now() };

  if (typeof data.bankDetails === 'string') {
    try {
      data.bankDetails = JSON.parse(data.bankDetails);
    } catch {
      data.bankDetails = [];
    }
  }

  let company = await Company.findOne();
  if (company) {
    Object.assign(company, data);
    await company.save();
  } else {
    company = await Company.create(data);
  }

  res.json({ message: 'Company settings saved', company });
};

const uploadAsset = async (req, res) => {
  const { type } = req.params;
  const allowed = ['logo', 'signature', 'stamp'];

  if (!allowed.includes(type)) {
    return res.status(400).json({ message: 'Invalid asset type' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  let company = await Company.findOne();
  if (!company) {
    company = new Company({ companyName: 'My Company' });
  }
  company[type] = req.file.path;
  await company.save();

  res.json({ message: `${type} uploaded successfully`, url: req.file.path });
};

module.exports = { getCompany, upsertCompany, uploadAsset };
