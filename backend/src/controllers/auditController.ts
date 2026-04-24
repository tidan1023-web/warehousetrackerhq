import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';

export async function listAuditLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      action,
      entityType,
      entityId,
      userId,
      startDate,
      endDate,
      page = '1',
      limit = '50',
    } = req.query;

    const query: Record<string, unknown> = {};
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) (query.timestamp as Record<string, unknown>).$gte = new Date(startDate as string);
      if (endDate) (query.timestamp as Record<string, unknown>).$lte = new Date(endDate as string);
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    res.json({
      logs,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getEntityAuditTrail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { entityType, entityId } = req.params;
    const logs = await AuditLog.find({ entityType, entityId })
      .sort({ timestamp: -1 })
      .lean();
    res.json({ logs });
  } catch (err) {
    next(err);
  }
}
