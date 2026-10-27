const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const findOne = (id) =>
  /^[0-9a-fA-F]{24}$/.test(id) ? Employee.findById(id) : Employee.findOne({ employeeId: id });

const handleError = (res, err) => {
  if (err.name === 'ValidationError')
    return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
  if (err.code === 11000)
    return res.status(409).json({ message: 'Mã nhân viên đã tồn tại' });
  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
};

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { $or: [
      { employeeId: new RegExp(escapeRegex(search), 'i') },
      { fullName: new RegExp(escapeRegex(search), 'i') }
    ] } : {};
    res.json(await Employee.find(filter).sort({ employeeId: 1 }));
  } catch (e) { handleError(res, e); }
});

router.get('/:id', async (req, res) => {
  try {
    const emp = await findOne(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(emp);
  } catch (e) { handleError(res, e); }
});

router.post('/', async (req, res) => {
  try { res.status(201).json(await Employee.create(req.body)); }
  catch (e) { handleError(res, e); }
});

router.put('/:id', async (req, res) => {
  try {
    const emp = await findOne(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    Object.assign(emp, req.body);
    await emp.save();
    res.json(emp);
  } catch (e) { handleError(res, e); }
});

router.delete('/:id', async (req, res) => {
  try {
    const emp = await findOne(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    await emp.deleteOne();
    res.json({ message: 'Đã xóa nhân viên' });
  } catch (e) { handleError(res, e); }
});

module.exports = router;
