const QsPrice = require('../models/QsPrice');

const getAll = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = new RegExp(req.query.category, 'i');

  const prices = await QsPrice.find(filter)
    .populate('createdBy', 'name')
    .sort({ category: 1, item: 1 });

  res.json({ prices });
};

const create = async (req, res) => {
  const price = await QsPrice.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ message: 'Price entry created', price });
};

const update = async (req, res) => {
  const price = await QsPrice.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  if (!price) return res.status(404).json({ message: 'Price entry not found' });
  res.json({ message: 'Price entry updated', price });
};

const remove = async (req, res) => {
  const price = await QsPrice.findByIdAndDelete(req.params.id);
  if (!price) return res.status(404).json({ message: 'Price entry not found' });
  res.json({ message: 'Price entry deleted' });
};

module.exports = { getAll, create, update, remove };
