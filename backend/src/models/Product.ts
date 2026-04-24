import mongoose, { Document, Schema } from 'mongoose';

export type ProductStatus = 'pending' | 'images_uploaded' | 'verified' | 'dispatched' | 'defective';

export type ImageViewType =
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top'
  | 'serial_number'
  | 'packaging'
  | 'custom';

export interface IProductImage {
  viewType: ImageViewType;
  label: string;
  s3Key: string;
  s3Url: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
  notes?: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  sku: string;
  name: string;
  category: string;
  description?: string;
  specifications: Map<string, string>;
  status: ProductStatus;
  assignedTo?: mongoose.Types.ObjectId;
  images: IProductImage[];
  requiredViews: ImageViewType[];
  imageVerificationComplete: boolean;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  dispatchedBy?: mongoose.Types.ObjectId;
  dispatchedAt?: Date;
  trackingNumber?: string;
  ebayListingId?: string;
  ebayItemId?: string;
  ebaySynced: boolean;
  ebaySyncedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>(
  {
    viewType: {
      type: String,
      enum: ['front', 'back', 'left', 'right', 'top', 'serial_number', 'packaging', 'custom'],
      required: true,
    },
    label: { type: String, required: true, trim: true },
    s3Key: { type: String, required: true },
    s3Url: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
    notes: { type: String, maxlength: 500 },
  },
  { _id: true }
);

const productSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z0-9-_]{3,50}$/,
    },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 200 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 2000 },
    specifications: {
      type: Map,
      of: String,
      default: new Map(),
    },
    status: {
      type: String,
      enum: ['pending', 'images_uploaded', 'verified', 'dispatched', 'defective'],
      default: 'pending',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [productImageSchema],
    requiredViews: {
      type: [String],
      default: ['front', 'back', 'left', 'right', 'serial_number'],
    },
    imageVerificationComplete: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    dispatchedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    dispatchedAt: { type: Date },
    trackingNumber: { type: String, trim: true, maxlength: 100 },
    ebayListingId: { type: String, trim: true },
    ebayItemId: { type: String, trim: true },
    ebaySynced: { type: Boolean, default: false },
    ebaySyncedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

productSchema.index({ sku: 1 });
productSchema.index({ status: 1 });
productSchema.index({ assignedTo: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ ebaySynced: 1, status: 1 });

productSchema.pre('save', function (next) {
  if (!this.images || !this.requiredViews) return next();
  const uploadedViews = new Set(this.images.map((img) => img.viewType));
  this.imageVerificationComplete = this.requiredViews.every((v) => uploadedViews.has(v));
  if (this.imageVerificationComplete && this.status === 'pending') {
    this.status = 'images_uploaded';
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
