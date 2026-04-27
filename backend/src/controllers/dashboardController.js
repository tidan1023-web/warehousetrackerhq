const Project = require('../models/Project');

const getSummary = async (req, res) => {
  const [total, active, planning, completed, onHold, cancelled] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'active' }),
    Project.countDocuments({ status: 'planning' }),
    Project.countDocuments({ status: 'completed' }),
    Project.countDocuments({ status: 'on_hold' }),
    Project.countDocuments({ status: 'cancelled' }),
  ]);

  const recentProjects = await Project.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('createdBy', 'name');

  res.json({
    stats: {
      total,
      active,
      planning,
      completed,
      onHold,
      cancelled,
      pendingApprovals: 0,
      invoices: { total: 0, pending: 0, paid: 0 },
    },
    recentProjects,
  });
};

module.exports = { getSummary };
