const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const listings = await Listing.find({ status: 'Active' }).populate('sellerId', 'name');
  res.json(listings);
});

router.get('/my-listings', auth, async (req, res) => {
  const listings = await Listing.find({ sellerId: req.user.userId });
  res.json(listings);
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('sellerId', 'name collegeEmail');
    if (!listing) return res.status(404).json({ message: 'Not found' });
    res.json(listing);
  } catch (err) { res.status(404).json({ message: 'Not found' }); }
});

router.post('/', auth, upload.array('images', 5), async (req, res) => {
  const { title, description, price, category } = req.body;
  const images = req.files.map(file => `/uploads/${file.filename}`);
  const newListing = new Listing({ title, description, price, category, images, sellerId: req.user.userId });
  await newListing.save();
  res.status(201).json(newListing);
});

router.delete('/:id', auth, async (req, res) => {
  await Listing.findOneAndDelete({ _id: req.params.id, sellerId: req.user.userId });
  res.json({ message: 'Deleted' });
});

module.exports = router;