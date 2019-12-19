const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

//Receive a post request and ad an item to a cart
router.post('/cart/products', async (req, res) => {
  //Figure out the cart!
  let cart;
  if (!req.session.cartId){
    //Need to create a cart 
    cart = await cartsRepo.create({ items: []});
    
    //Store cart id to req.session.cartId property
    req.session.cartId = cart.id;

  } else {
    //We have a cart and need to get it from repository
   cart = await cartsRepo.getOne(req.session.cartId);
  }

  //Either increment quantity for existing product or add new product to items array
  const existingItem = cart.items.find(item => item.id === req.body.productId)
  if (existingItem) {
    //increment quantity and save cart
    existingItem.quantity++;
  } else {
    //Add new product to items array
    cart.items.push({ id: req.body.productId, quantity: 1});
  }
  await cartsRepo.update(cart.id, {
    items: cart.items
  });
  res.send("Product added!")
});

//Receive a get request to show all items in cart 

//Receive a post request to delete an item from the cart

module.exports = router;