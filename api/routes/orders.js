const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const ordersController = require('../controllers/orders')

router.get('/', checkAuth, ordersController.orders_GET_all)

router.post('/', checkAuth, ordersController.orders_CREATE_order)

router.get('/:orderID', checkAuth, ordersController.orders_GET_order)

router.delete('/:orderID', checkAuth, ordersController.orders_DELETE_order)

module.exports = router 