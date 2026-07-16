const Post = require('../models/Post');

async function getAll(req, res, next) {
  try {
    const { status, limit, offset } = req.query;
    const posts = await Post.findAll({ status, limit, offset });
    res.json({ success: true, data: posts });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const post = await Post.create({ ...req.body, author_id: req.user.id });
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const post = await Post.update(req.params.id, req.body);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await Post.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };
