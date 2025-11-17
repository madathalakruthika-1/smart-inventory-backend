const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// Get items for this logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.userId }).sort('-createdAt');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item for this logged-in user
router.post('/', auth, async (req, res) => {
  try {
    const { name, sku, quantity, unit, category, notes } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const item = await Item.create({
      userId: req.user.userId,
      name, sku, quantity: quantity || 0, unit, category, notes
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
