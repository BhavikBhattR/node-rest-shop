const express = require('express');

const app = express()

const morgan = require('morgan');

const bodyParser = require('body-parser');


const productsRouter = require('./api/routes/products')
const ordersRouter = require('./api/routes/orders')

const mongoose = require('mongoose');

const escapedPassword = encodeURIComponent(process.env.MONGO_ATLAS_PW);
mongoose.connect(`mongodb+srv://BhattBhavikR:${escapedPassword}@shop-products-orders.tdglcxy.mongodb.net/?retryWrites=true&w=majority`)

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Origin, X-Requested-With"
        )
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res;
    }
    next()
})

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)


app.use((req,res,next)=>{
    const err = new Error('tu jo dhundh rha hai wo nahi he');
    err.status = 404;
    next(err);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    })
})

module.exports = app