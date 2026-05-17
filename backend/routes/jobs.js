const router = require('express').Router();
const Job = require('../models/JobRequest');
const auth = require('../middleware/auth');

// GET /api/jobs?category=Plumbing&status=Open&search=keyword
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;

    if (req.query.search) {
      filter.$or = [
        { title:       { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { next(err); }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { next(err); }
});

// POST /api/jobs - protected
router.post('/', auth, async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    if (err.name === 'ValidationError')
      return res.status(400).json({ error: err.message });
    next(err);
  }
});

// PATCH /api/jobs/:id - update status only
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { next(err); }
});

// DELETE /api/jobs/:id - protected
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
});

module.exports = router;