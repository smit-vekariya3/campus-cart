const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, collegeEmail, password } = req.body;
    let user = await User.findOne({ collegeEmail });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({ name, collegeEmail, passwordHash });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: user._id, name: user.name });
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/login', async (req, res) => {
  try {
    const { collegeEmail, password } = req.body;
    const user = await User.findOne({ collegeEmail });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, name: user.name });
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/saved', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).populate({
    path: 'savedItems',
    populate: { path: 'sellerId', select: 'name' }
  });
  res.json(user.savedItems);
});

router.post('/save/:id', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user.savedItems.includes(req.params.id)) {
    user.savedItems = user.savedItems.filter(id => id.toString() !== req.params.id);
  } else {
    user.savedItems.push(req.params.id);
  }
  await user.save();
  res.json(user.savedItems);
});

module.exports = router;