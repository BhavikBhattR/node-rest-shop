const express = require('express');

const router = express.Router();

router.get('/', (req,res,next)=>{
    res.status(200).json({
        message: "handling get req of /orders"
    })
})

router.post('/', (req,res,next)=>{
    res.status(201).json({
        message: "handling post req of /orders"
    })
})

router.get('/:orderID', (req,res,next)=>{
    res.status(200).json({
        message: "order details of " + req.params.orderID
    })
})

router.delete('/:orderID', (req,res,next)=>{
    res.status(200).json({
        message: "order deleted for " + req.params.orderID
    })
})

module.exports = router