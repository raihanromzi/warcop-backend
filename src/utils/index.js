const { responseSuccess, responseError } = require('./responses/responses')
const prisma = require('./prisma/client.cjs')

module.exports = { responseSuccess, responseError, prisma }
