const { PrismaClient } = require('@prisma/client')
const Joi = require('joi')
const { responseSuccess, responseError } = require('../utils/index')
const prisma = new PrismaClient()

exports.getAllStockTransfers = async (req, res) => {
  try {
    const stockTransfers = await prisma.stockTransfer.findMany({
      include: { technician: true, warehouseAdmin: true },
    })
    return res.status(200).send(responseSuccess(200, 'OK', '', stockTransfers))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.getStockTransferById = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
    })

    const { error, value } = schema.validate(req.params)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const stockTransfer = await prisma.stockTransfer.findUnique({
      where: { id: value.id },
      include: {
        technician: true,
        warehouseAdmin: true,
        details: { include: { stock: true } },
      },
    })

    if (!stockTransfer) {
      return res
        .status(404)
        .send(responseError(404, 'NOT FOUND', 'Stock transfer not found'))
    }

    return res.status(200).send(responseSuccess(200, 'OK', '', stockTransfer))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.createStockTransfer = async (req, res) => {
  try {
    const schema = Joi.object({
      warehouseAdminId: Joi.number().integer().positive().required(),
      technicianId: Joi.number().integer().positive().required(),
      nik: Joi.string().required(),
      details: Joi.array()
        .items(
          Joi.object({
            stockId: Joi.number().integer().positive().required(),
            quantity: Joi.number().integer().positive().required(),
          })
        )
        .required(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const existingTechnician = await prisma.technician.findUnique({
      where: { id: value.technicianId },
    })

    if (!existingTechnician) {
      return res
        .status(404)
        .send(
          responseError(
            404,
            'NOT FOUND',
            'Technician with the provided ID does not exist'
          )
        )
    }

    const existingWarehouseAdmin = await prisma.warehouseAdmin.findUnique({
      where: { id: value.warehouseAdminId },
    })

    if (!existingWarehouseAdmin) {
      return res
        .status(404)
        .send(
          responseError(
            404,
            'NOT FOUND',
            'Warehouse admin with the provided ID does not exist'
          )
        )
    }

    const stockIds = value.details.map((detail) => detail.stockId)

    const existingStocks = await prisma.stock.findMany({
      where: { id: { in: stockIds } },
      select: { id: true, quantity: true },
    })

    const invalidStockIds = stockIds.filter(
      (stockId) => !existingStocks.find((stock) => stock.id === stockId)
    )

    if (invalidStockIds.length > 0) {
      return res
        .status(404)
        .send(
          responseError(
            404,
            `STOCK NOT FOUND`,
            `Stock with ID ${invalidStockIds.join(', ')} not found`
          )
        )
    }

    const insufficientStocks = value.details.filter(
      (detail) =>
        existingStocks.find((stock) => stock.id === detail.stockId).quantity <
        detail.quantity
    )

    if (insufficientStocks.length > 0) {
      return res
        .status(409)
        .send(
          responseError(
            409,
            `INSUFFICIENT STOCKS`,
            `Insufficient stocks for ID ${insufficientStocks
              .map((detail) => detail.stockId)
              .join(', ')}`
          )
        )
    }

    const createdStockTransfer = await prisma.stockTransfer.create({
      data: {
        warehouseAdminId: value.warehouseAdminId,
        technicianId: value.technicianId,
        nik: value.nik,
        date: new Date(),
        details: {
          create: value.details.map((detail) => ({
            stockId: detail.stockId,
            quantity: detail.quantity,
          })),
        },
      },
      include: {
        technician: true,
        warehouseAdmin: true,
        details: { include: { stock: true } },
      },
    })

    // Update the stock quantities
    for (const detail of createdStockTransfer.details) {
      await prisma.stock.update({
        where: { id: detail.stock.id },
        data: {
          quantity: detail.stock.quantity - detail.quantity,
        },
      })
    }

    const response = {
      technicianName: createdStockTransfer.technician.name,
      technicianId: createdStockTransfer.technicianId,
      nik: createdStockTransfer.nik,
      warehouseAdminId: createdStockTransfer.warehouseAdminId,
      warehouseAdminName: createdStockTransfer.warehouseAdmin.name,
      date: createdStockTransfer.date,
      details: createdStockTransfer.details.map((detail) => ({
        stockId: detail.stockId,
        quantity: detail.quantity,
        stock: detail.stock,
      })),
    }

    return res.status(201).send(responseSuccess(201, 'CREATED', '', response))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}
