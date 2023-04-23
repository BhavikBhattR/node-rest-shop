const express = require('express');

const router = express.Router()

const Product = require('../models/product');

const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dibsjiozz",
    api_key: "734327239785754",
    api_secret: "VY0o3syKgdRWfrrasTjtXPVs49I"
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'productImages'
    }
  });
 
const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null, './uploads');
//     },
//     filename: function(req,file,cb){
//         cb(null, new Date().toISOString() + '-' + file.originalname)
//     }
// })

const fileFilter = (req,file,cb) =>{
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
    cb(() => new Error('please add correct file'), false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


router.get('/', (req,res,next)=>{
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
})

router.post('/', checkAuth, upload.single('productImage'), (req,res,next)=>{
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
})

router.get('/:productID', (req,res,next)=>{
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
})

router.patch('/:productID', checkAuth, (req,res,next)=>{
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
})

router.delete('/:productID', checkAuth, (req,res,next)=>{
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
})

module.exports = router