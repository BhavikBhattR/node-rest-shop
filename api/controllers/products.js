const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_GET_all = (req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs =>{
         const response = {
             count: docs.length,
             products: docs.map(doc => {
                 return {
                     name: doc.name,
                     price: doc.price,
                     _id: doc._id,
                     productImage: doc.productImage,
                     request: {
                         type: 'GET',
                         url: `http://localhost:3000/products/${doc._id}`
                     }
                 }
             })
         }
         if(docs.length >=0){
             res.status(200).json(response)
         }else{
             res.status(404).json({
                 message: "no entries found"
             })
         }
    })
    .catch(err =>{
     console.log(err);
     res.status(500).json({
         error: err
     })
    });
 }

 exports.products_POST_product = (req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Created Product Successfully ✨",
            createProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        })
    })
    .catch(err => {
        err => console.log(err);
        res.status(500).json({
            error: err
        })
    });
}

exports.products_GET_product = (req,res,next)=>{
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log('from db',doc)
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all Products',
                    url: 'http://localhost:3000/products'
                }
            })
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
}

exports.products_PATCH_product = (req,res,next)=>{
    const id = req.params.productID;
    const updatedOps = {};
    for(const ops of req.body){
        updatedOps[ops.propName] = ops.value
    }
    Product.updateOne({
        _id: id
    },
    {
        $set: updatedOps
    }
    ).exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: `http://localhost:3000/products/${id}`
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.products_DELETE_product = (req,res,next)=>{
    const id = req.params.productID;
    Product.findOneAndRemove({
        _id : id
    })
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500)
        .json({
            error: err
        })
    })
}