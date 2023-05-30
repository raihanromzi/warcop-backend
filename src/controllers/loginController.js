require('dotenv').config()
const { responseSuccess, responseError } = require('../utils/index')
const jwt = require('jsonwebtoken')
const { prisma } = require('../utils/index')

const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password || username === '' || password === '') {
    return res
      .status(400)
      .send(responseError(400, 'BAD_REQUEST', 'INVALID USERNAME OR PASSWORD'))
  }

  try {
    const payload = { username, password }
    const token = jwt.sign(payload, process.env.ACCESS_KEY)

    if (
      username === process.env.USERNAME_ADMIN &&
      password === process.env.PASSWORD_ADMIN
    ) {
      return res.status(200).send(responseSuccess(200, 'OK', null, { token }))
    }

    const user = await prisma.warehouseAdmin.findFirst({
      where: {
        username,
      },
    })

    if (!user) {
      return res
        .status(404)
        .send(responseError(404, 'NOT_FOUND', 'USER NOT FOUND'))
    }

    return res.status(200).send(responseSuccess(200, 'OK', null, { token }))
  } catch (error) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL_SERVER_ERROR', error))
  }
}

module.exports = { login }
