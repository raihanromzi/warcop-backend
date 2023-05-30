const { PrismaClient } = require('@prisma/client')
const { responseSuccess, responseError } = require('../utils/index')
const Joi = require('joi')
const prisma = new PrismaClient()

exports.getAllWarehouseAdmins = async (req, res) => {
  try {
    const warehouseAdmins = await prisma.warehouseAdmin.findMany()
    return res.status(200).send(responseSuccess(200, 'OK', '', warehouseAdmins))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.getWarehouseAdminById = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
    })

    const { error, value } = schema.validate(req.params)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const warehouseAdmin = await prisma.warehouseAdmin.findUnique({
      where: { id: value.id },
    })

    if (!warehouseAdmin) {
      return res
        .status(404)
        .send(responseError(404, 'NOT FOUND', 'Admin not found'))
    }

    return res.status(200).send(responseSuccess(200, 'OK', '', warehouseAdmin))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.createWarehouseAdmin = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
    })

    const { error, value } = schema.validate(req.body)
    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const existingAdmin = await prisma.warehouseAdmin.findFirst({
      where: {
        username: value.username,
      },
    })
    if (existingAdmin) {
      return res
        .status(409)
        .send(responseError(409, 'CONFLICT', 'Username already exists'))
    }

    const warehouseAdmin = await prisma.warehouseAdmin.create({
      data: value,
    })

    return res
      .status(201)
      .send(responseSuccess(201, 'CREATED', '', warehouseAdmin))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.updateWarehouseAdmin = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
      name: Joi.string().optional(),
      username: Joi.string().optional(),
      password: Joi.string().min(6).optional(),
    }).min(2)

    const { error: inputError, value: inputData } = schema.validate({
      ...req.params,
      ...req.body,
    })

    if (inputError) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', inputError))
    }

    const existingAdmin = await prisma.warehouseAdmin.findFirst({
      where: { username: inputData.username },
    })

    if (existingAdmin && existingAdmin.id !== parseInt(inputData.id)) {
      return res.status(409).send(409, 'CONFLICT', 'Username already exists')
    }

    const warehouseAdmin = await prisma.warehouseAdmin.update({
      where: { id: parseInt(inputData.id) },
      data: inputData,
    })

    return res.status(200).send(responseSuccess(200, 'OK', '', warehouseAdmin))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.deleteWarehouseAdmin = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
    })

    const { error, value } = schema.validate(req.params)
    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const warehouseAdmin = await prisma.warehouseAdmin.delete({
      where: { id: value.id },
    })
    return res
      .status(200)
      .send(responseSuccess(200, 'DELETED', '', warehouseAdmin))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}
