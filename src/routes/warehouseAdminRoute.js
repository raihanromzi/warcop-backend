const express = require('express')
const router = express.Router()

const warehouseAdminController = require('../controllers/warehouseAdminController')

router
  .route('/warehouse-admins')
  .get(warehouseAdminController.getAllWarehouseAdmins)
  .post(warehouseAdminController.createWarehouseAdmin)

router
  .route('/warehouse-admins/:id')
  .get(warehouseAdminController.getWarehouseAdminById)
  .put(warehouseAdminController.updateWarehouseAdmin)
  .delete(warehouseAdminController.deleteWarehouseAdmin)

module.exports = router
