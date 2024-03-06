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

    // Attempt to match the order with any existing opposite type orders for the same stock and price
    const oppositeOrderType = orderType === 'buy' ? 'sell' : 'buy';
    let match = await Order.findOne({ 
      stock, 
      orderType: oppositeOrderType, 
      price, 
      quantity: { $gte: newOrder.quantity - newOrder.filledQuantity },
    }).sort({ createdAt: 1 }); // Find the earliest order that can fully or partially fill the new order

    if (match) {
      // Calculate the fillable quantity
      const fillableQuantity = Math.min(quantity - newOrder.filledQuantity, match.quantity - match.filledQuantity);

      // Update the filled quantities for both the new order and the matching order
      newOrder.filledQuantity += fillableQuantity;
      match.filledQuantity += fillableQuantity;

      newOrder.status = newOrder.filledQuantity === newOrder.quantity ? 'filled' : 'partially_filled';
await newOrder.save();

if (match.filledQuantity === match.quantity) {
  match.status = 'filled';
} else {
  match.status = 'partially_filled';
}
await match.save();

      // Update stock price with the matched order's price
      await Stock.findByIdAndUpdate(stock, { currentPrice: price });
      
      return res.status(200).json({ message: 'Order matched and executed partially or fully', newPrice: price });
    }

   
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create or match order' });
  }
});

module.exports = router;
