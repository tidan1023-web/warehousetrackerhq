import { Request } from 'express';
import { AuditLog, AuditAction, AuditEntityType } from '../models/AuditLog';
import { IUser } from '../models/User';
import logger from './logger';
import mongoose from 'mongoose';

interface AuditParams {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: mongoose.Types.ObjectId | string;
  user: IUser;
  details?: Record<string, unknown>;
  req?: Request;
}

export async function createAuditLog(params: AuditParams): Promise<void> {
  try {
    await AuditLog.create({
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      userId: params.user._id,
      employeeId: params.user.employeeId,
      userEmail: params.user.email,
      userName: params.user.name,
      details: params.details || {},
      ipAddress: params.req
        ? (params.req.headers['x-forwarded-for'] as string) || params.req.ip
        : undefined,
      userAgent: params.req?.headers['user-agent'],
    });
  } catch (err) {
    // Audit log failure must never crash the main request
    logger.error('Failed to create audit log', { error: (err as Error).message, params });
  }
}
