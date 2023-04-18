const express = require('express');

const router = express.Router()

const Product = require('../models/product');

const mongoose = require('mongoose');

router.get('/', (req,res,next)=>{
   Product.find()
   .exec()
   .then(docs =>{
        console.log(docs);
        res.status(200).json(docs)
   })
   .catch(err =>{
    console.log(err);
    res.status(500).json({
        error: err
    })
   });
})

router.post('/', (req,res,next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result =>{
        console.log(result);
        res.status(201).json({
            message: "handling post req of /products ✨",
            createProduct: product
        })
    })
    .catch(err => {
        err => console.log(err);
        res.status(500).json({
            error: err
        })
    });
})

router.get('/:productID', (req,res,next)=>{
    const id = req.params.productID;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log('from db',doc)
        if(doc){
            res.status(200).json(doc)
        }else{
            return res.status(404).json({
                message: "no valid entry for given id"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
                err
        })
    });
})

router.patch('/:productID', (req,res,next)=>{
    res.status(200).json({
        message: 'updated the product'
    })
})

router.delete('/:productID', (req,res,next)=>{
    const id = req.params.productID;
    Product.findOneAndRemove({
        _id : id
    })
    .exec()
    .then(result =>{
        res.status(200).json(result)
    })
    .catch()
})

module.exports = router