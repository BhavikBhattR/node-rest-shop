const express = require('express');

const router = express.Router()

const Product = require('../models/product');

const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const productsController = require('../controllers/products')

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


router.get('/', productsController.products_GET_all)

router.post('/', checkAuth, upload.single('productImage'), productsController.products_POST_product)

router.get('/:productID', productsController.products_GET_product)

router.patch('/:productID', checkAuth, productsController.products_PATCH_product)

router.delete('/:productID', checkAuth, productsController.products_DELETE_product)

module.exports = router