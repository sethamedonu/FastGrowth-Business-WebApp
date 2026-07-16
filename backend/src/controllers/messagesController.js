const Message    = require('../models/Message');
const { sendEmail } = require('../config/ses');

async function getAll(req, res, next) {
  try {
    const { status, limit, offset } = req.query;
    const messages = await Message.findAll({ status, limit, offset });
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const message = await Message.updateStatus(req.params.id, req.body.status);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await Message.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, updateStatus, remove };
