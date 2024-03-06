const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Stock = require('../models/stockModel');

router.post('/', async (req, res) => {
  const { stock, orderType, price, quantity } = req.body;

  try {
    // Create the new order
    const newOrder = new Order(req.body);
    await newOrder.save();

    // Attempt to match the order
    const oppositeOrderType = orderType === 'buy' ? 'sell' : 'buy';
    const match = await Order.findOne({ stock, orderType: oppositeOrderType, price, quantity });

    if (match) {
      // Update stock price with the matched order's price
      await Stock.findByIdAndUpdate(stock, { currentPrice: price });

      // Here, we simply delete both orders for simplicity
      // You might choose to update them instead based on your application logic
      await Order.findByIdAndDelete(newOrder._id);
      await Order.findByIdAndDelete(match._id);

      return res.status(200).json({ message: 'Order matched and executed', newPrice: price });
    }

    // If no match, return the newly created order
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create or match order' });
  }
});

module.exports = router;
