require('dotenv').config()
const express = require('express')
const port = +(process.env.PORT || 8000)
const app = express()

const routes = require('./routes/index')
const { jwtAuth } = require('./middlewares/index')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(jwtAuth)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1', routes.loginRoute)

app.listen(port, () => {
  console.log(`APP RUNNING at ${port} ✅`)
})
