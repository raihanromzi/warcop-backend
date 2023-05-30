require('dotenv').config()
const express = require('express')
const port = +(process.env.PORT || 8000)
const app = express()

const routes = require('./routes/index')
const { jwtAuth } = require('./middlewares/index')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', routes.loginRoute)
app.use(jwtAuth)

app.use('/api/v1', routes.warehouseAdminRoute)
app.use('/api/v1', routes.technicianRoute)
app.use('/api/v1', routes.stockRoute)
app.use('/api/v1', routes.stockTransferRoute)

app.listen(port, () => {
  console.log(`APP RUNNING at ${port} ✅`)
})
