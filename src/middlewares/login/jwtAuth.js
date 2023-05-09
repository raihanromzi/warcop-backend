const express = require('express')
const jwt = require('jsonwebtoken')
const { responseError } = require('../../utils/index')

const router = express.Router() // gunakan express.Router()

router.use((req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token === null) {
    res.status(401).send(responseError(401, 'UNAUTHORIZED', 'ACCESS DENIED'))
    return
  }

  // Verify JWT
  jwt.verify(token, process.env.ACCESS_KEY, (err) => {
    if (err) {
      res.status(403).send(responseError(403, 'FORBIDDEN', 'ACCESS FORBIDDEN'))
    } else {
      next()
    }
  })
})

module.exports = router
