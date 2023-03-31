const express = require('express');

const app = express()

const productsRouter = require('./api/routes/products')
const ordersRouter = require('./api/routes/orders')

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

module.exports = app