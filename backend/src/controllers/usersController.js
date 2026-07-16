const User = require('../models/User');

async function getAll(req, res, next) {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const user = await User.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    // Prevent self-deletion
    if (req.params.id === String(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const deleted = await User.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };
