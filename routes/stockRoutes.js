const express = require('express');
const router = express.Router();
const Stock = require('../models/stockModel');

// Add a new stock
router.post('/', async (req, res) => {
  try {
    const stock = new Stock(req.body);
    await stock.save();
    res.status(201).send(stock);
  } catch (error) {
    res.status(400).send(error);
  }
});

// List all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.status(200).send(stocks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add more stock-related routes as needed...

module.exports = router;
