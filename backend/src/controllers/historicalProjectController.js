const HistoricalProject = require('../models/HistoricalProject');

exports.list = async (req, res, next) => {
  try {
    const projects = await HistoricalProject
      .find({ companyId: req.user.companyId })
      .sort({ completedYear: -1, createdAt: -1 })
      .lean();
    res.json({ projects });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const project = await HistoricalProject.create({
      ...req.body,
      companyId: req.user.companyId,
      createdBy: req.user._id,
    });
    res.status(201).json({ project });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const project = await HistoricalProject.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await HistoricalProject.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
