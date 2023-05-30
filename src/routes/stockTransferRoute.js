const express = require('express')
const {
  createStockTransfer,
  getStockTransferById,
  getAllStockTransfers,
} = require('../controllers/stockTransferController')
const router = express.Router()

router.post('/stock-transfer', createStockTransfer)
router.get('/stock-transfer/:id', getStockTransferById)
router.get('/stock-transfer', getAllStockTransfers)

module.exports = router
