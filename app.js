const express = require('express');

const app = express()

const morgan = require('morgan');

const productsRouter = require('./api/routes/products')
const ordersRouter = require('./api/routes/orders')

app.use(morgan('dev'))

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