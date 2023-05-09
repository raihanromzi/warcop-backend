require('dotenv').config()
const express = require('express')
const port = +(process.env.PORT || 8000)
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`APP RUNNING at ${port} ✅`)
})
