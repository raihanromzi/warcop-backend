const express = require('express')
const router = express.Router()
const stockController = require('../controllers/stockController')

router
  .route('/stocks')
  .get(stockController.getAllStocks)
  .post(stockController.createStock)

router
  .route('/stocks/:id')
  .get(stockController.getStockById)
  .put(stockController.updateStock)
  .delete(stockController.deleteStock)

module.exports = router
