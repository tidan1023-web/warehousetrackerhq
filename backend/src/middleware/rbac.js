'use strict';

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role,
      });
      return;
    }
    next();
  };
}

const requireAdmin = requireRole('admin');
const requireStaff = requireRole('admin', 'staff');

module.exports = { requireRole, requireAdmin, requireStaff };
