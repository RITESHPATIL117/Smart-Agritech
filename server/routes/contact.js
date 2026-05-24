const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { contactRules } = require('../middleware/validators');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', contactRules, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully', id: contact._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
