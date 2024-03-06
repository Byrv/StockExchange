// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // Optional: Add validation for req.body contents here

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user instance
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // Save the user to the database
    const newUser = await user.save();
    res.status(201).send({ userId: newUser._id, username: newUser.username, email: newUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering new user.');
  }
});

module.exports = router;
