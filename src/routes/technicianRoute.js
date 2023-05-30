const express = require('express')
const router = express.Router()
const technicianController = require('../controllers/technicianController')

router
  .route('/technicians')
  .get(technicianController.getAllTechnicians)
  .post(technicianController.createTechnician)

router
  .route('/technicians/:id')
  .get(technicianController.getTechnicianById)
  .put(technicianController.updateTechnician)
  .delete(technicianController.deleteTechnician)

module.exports = router
