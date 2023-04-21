const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const router = express.Router();

router.get('/', (req,res,next)=>{
   Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/orders/${doc._id}`
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.post('/', (req,res,next)=>{
    Product.findById(req.body.productID)
    .exec()
    .then(product => {
        if(!product){
            res.status(404).json({
                message: "product not found"
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productID
        });
        return order
          .save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                product: result.productID,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: `http://localhost:3000/orders/${result._id}`
            }
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
      })
})

router.get('/:orderID', (req,res,next)=>{
    Product.findById(req.params.orderID).exec()
    .then(order=> {
        if(!order){
            res.status(404).json({
                message: "order not found"
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
})

router.delete('/:orderID', (req,res,next)=>{
    Order.findOneAndRemove({_id: req.params.orderID})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {productID: "ID", quantity: "Number"}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router 