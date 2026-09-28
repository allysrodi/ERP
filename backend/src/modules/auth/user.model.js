import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from './permissions.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  lastName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true, maxlength: 30 },
  password: { type: String, required: true, select: false, minlength: 8 },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.EMPLEADO, index: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
  lastLoginAt: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  passwordResetTokenHash: String,
  passwordResetExpiresAt: Date
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.models.User ?? mongoose.model('User', userSchema);
