const MaterialPrice = require('../models/MaterialPrice');

const getAll = async (req, res) => {
  const filter = {};
  if (req.query.material) filter.material = new RegExp(req.query.material, 'i');
  if (req.query.supplier) filter.supplier = new RegExp(req.query.supplier, 'i');

  const prices = await MaterialPrice.find(filter)
    .populate('createdBy', 'name')
    .sort({ material: 1 });

  res.json({ prices });
};

const create = async (req, res) => {
  const price = await MaterialPrice.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ message: 'Material price created', price });
};

const update = async (req, res) => {
  const price = await MaterialPrice.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  if (!price) return res.status(404).json({ message: 'Material price not found' });
  res.json({ message: 'Material price updated', price });
};

const remove = async (req, res) => {
  const price = await MaterialPrice.findByIdAndDelete(req.params.id);
  if (!price) return res.status(404).json({ message: 'Material price not found' });
  res.json({ message: 'Material price deleted' });
};

module.exports = { getAll, create, update, remove };
