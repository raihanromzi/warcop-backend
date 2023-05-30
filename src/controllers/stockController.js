const { PrismaClient } = require('@prisma/client')
const Joi = require('joi')
const { responseSuccess, responseError } = require('../utils/index')
const prisma = new PrismaClient()

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany()
    return res.status(200).send(responseSuccess(200, 'OK', '', stocks))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.getStockById = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
    })

    const { error, value } = schema.validate(req.params)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const stock = await prisma.stock.findUnique({
      where: { id: value.id },
    })

    if (!stock) {
      return res
        .status(404)
        .send(responseError(404, 'NOT FOUND', 'Stock not found'))
    }

    return res.status(200).send(responseSuccess(200, 'OK', '', stock))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.createStock = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      quantity: Joi.number().integer().positive().required(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const stock = await prisma.stock.create({
      data: value,
    })

    return res.status(201).send(responseSuccess(201, 'CREATED', '', stock))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.updateStock = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
      name: Joi.string().optional(),
      quantity: Joi.number().integer().positive().optional(),
    }).min(2)

    const { error: inputError, value: inputData } = schema.validate({
      ...req.params,
      ...req.body,
    })

    if (inputError) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', inputError))
    }

    const stock = await prisma.stock.update({
      where: { id: parseInt(inputData.id) },
      data: inputData,
    })

    return res.status(200).send(responseSuccess(200, 'OK', '', stock))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.deleteStock = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
    })

    const { error, value } = schema.validate(req.params)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const stock = await prisma.stock.delete({
      where: { id: value.id },
    })

    return res.status(200).send(responseSuccess(200, 'DELETED', '', stock))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}
