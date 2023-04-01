const express = require('express');

const router = express.Router()


router.get('/', (req,res,next)=>{
    res.status(200).json({
        message: "handling get req of /products 🤟"
    })
})

router.post('/', (req,res,next)=>{
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message: "handling post req of /products ✨",
        createProduct: product
    })
})

router.get('/:productID', (req,res,next)=>{
    const id = req.params.productID;
    if(id === 'special'){
        res.status(200).json({
            message: 'you discovered the special id',
            id: id
        })
    }else{
        res.status(200).json({
            message: 'you passed an ID'
        })
    }
})

router.patch('/:productID', (req,res,next)=>{
    res.status(200).json({
        message: 'updated the product'
    })
})

router.delete('/:productID', (req,res,next)=>{
    res.status(200).json({
        message: 'deleted the product'
    })
})

module.exports = router