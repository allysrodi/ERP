import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, index: true },
  module: { type: String, required: true, index: true },
  recordId: { type: mongoose.Schema.Types.ObjectId },
  changes: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

export const AuditLog = mongoose.models.AuditLog ?? mongoose.model('AuditLog', auditSchema, 'audit_logs');
