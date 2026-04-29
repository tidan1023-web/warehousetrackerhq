const mongoose = require('mongoose');

const changeOrderSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  boqVersionId: { type: mongoose.Schema.Types.ObjectId, ref: 'BoqVersion', default: null },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  reason: { type: String },
  originalCost: { type: Number, required: true, min: 0 },
  newCost: { type: Number, required: true, min: 0 },
  difference: { type: Number, default: 0 }, // computed: newCost - originalCost
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  approvedAt: { type: Date, default: null },
}, { timestamps: true });

changeOrderSchema.pre('save', function (next) {
  this.difference = parseFloat((this.newCost - this.originalCost).toFixed(2));
  next();
});

module.exports = mongoose.model('ChangeOrder', changeOrderSchema);
