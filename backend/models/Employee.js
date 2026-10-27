const mongoose = require('mongoose');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: [true, 'Mã nhân viên là bắt buộc'], unique: true, trim: true },
  fullName: { type: String, required: [true, 'Họ tên là bắt buộc'], trim: true },
  gender: String,
  dateOfBirth: String,
  department: String,
  position: String,
  email: { type: String, required: [true, 'Email là bắt buộc'], trim: true, match: [emailRegex, 'Email không hợp lệ'] },
  phone: String,
  hireDate: String,
  status: { type: String, default: 'Đang làm việc' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema, 'employees');
