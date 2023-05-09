require('dotenv').config()
const { responseSuccess, responseError } = require('../utils/index')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { username, password } = req.body
  if (
    !username ||
    !password ||
    username === '' ||
    password === '' ||
    username !== process.env.USERNAME_ADMIN ||
    password !== process.env.PASSWORD_ADMIN
  ) {
    return res
      .status(400)
      .send(responseError(400, 'BAD_REQUEST', 'INVALID USERNAME OR PASSWORD'))
  }

  try {
    const payload = { username, password }
    const token = jwt.sign(payload, process.env.ACCESS_KEY)
    return res.status(200).send(responseSuccess(200, 'OK', null, { token }))
  } catch (error) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL_SERVER_ERROR', error))
  }
}

module.exports = { login }
