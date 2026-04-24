import mongoose, { Document, Schema } from 'mongoose';

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DEACTIVATED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'IMAGE_UPLOADED'
  | 'IMAGE_DELETED'
  | 'PRODUCT_VERIFIED'
  | 'PRODUCT_DISPATCHED'
  | 'DISPATCH_BLOCKED'
  | 'DEFECT_LOGGED'
  | 'DEFECT_ACKNOWLEDGED'
  | 'DEFECT_RESOLVED'
  | 'EBAY_LISTING_CREATED'
  | 'EBAY_LISTING_SYNCED'
  | 'EBAY_AUTH_CONNECTED';

export type AuditEntityType = 'user' | 'product' | 'defect' | 'shipment' | 'ebay_listing' | 'system';

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  userEmail: string;
  userName: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    entityType: {
      type: String,
      enum: ['user', 'product', 'defect', 'shipment', 'ebay_listing', 'system'],
      required: true,
    },
    entityId: { type: Schema.Types.Mixed },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, immutable: true },
  },
  {
    // Audit logs are append-only — disable update/delete at schema level
    timestamps: false,
  }
);

// Compound indexes for fast compliance queries
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

// Block any attempt to update or delete audit records at the model level
auditLogSchema.pre('findOneAndUpdate', function () {
  throw new Error('Audit logs are immutable and cannot be modified');
});
auditLogSchema.pre('updateOne', function () {
  throw new Error('Audit logs are immutable and cannot be modified');
});
auditLogSchema.pre('updateMany', function () {
  throw new Error('Audit logs are immutable and cannot be modified');
});
auditLogSchema.pre('deleteOne', function () {
  throw new Error('Audit logs are immutable and cannot be modified');
});
auditLogSchema.pre('deleteMany', function () {
  throw new Error('Audit logs are immutable and cannot be modified');
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
