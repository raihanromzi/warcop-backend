const { PrismaClient } = require('@prisma/client')
const Joi = require('joi')
const { responseSuccess, responseError } = require('../utils/index')
const prisma = new PrismaClient()

exports.getAllTechnicians = async (req, res) => {
  try {
    const technicians = await prisma.technician.findMany()
    return res.status(200).send(responseSuccess(200, 'OK', '', technicians))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.getTechnicianById = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
    })

    const { error, value } = schema.validate(req.params)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const technician = await prisma.technician.findFirst({
      where: { id: value.id },
    })

    if (!technician) {
      return res
        .status(404)
        .send(responseError(404, 'NOT FOUND', 'Technician not found'))
    }

    return res.status(200).send(responseSuccess(200, 'OK', '', technician))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.createTechnician = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      nik: Joi.string().required(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    const existingTechnician = await prisma.technician.findFirst({
      where: { nik: value.nik },
    })

    if (existingTechnician) {
      return res
        .status(409)
        .send(responseError(409, 'CONFLICT', 'NIK already exists'))
    }

    const technician = await prisma.technician.create({
      data: value,
    })

    return res.status(201).send(responseSuccess(201, 'CREATED', '', technician))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.updateTechnician = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
      name: Joi.string().optional(),
      nik: Joi.string().optional(),
    }).min(2)

    const { error: inputError, value: inputData } = schema.validate({
      ...req.params,
      ...req.body,
    })

    if (inputError) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', inputError))
    }

    const existingTechnician = await prisma.technician.findFirst({
      where: { nik: inputData.nik },
    })

    if (
      existingTechnician &&
      existingTechnician.id !== parseInt(inputData.id)
    ) {
      return res
        .status(409)
        .send(responseError(409, 'CONFLICT', 'NIK already exists'))
    }

    const technician = await prisma.technician.update({
      where: { id: parseInt(inputData.id) },
      data: inputData,
    })

    return res.status(200).send(responseSuccess(200, 'OK', '', technician))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}

exports.deleteTechnician = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
    })

    const { error, value } = schema.validate(req.params)

    if (error) {
      return res.status(400).send(responseError(400, 'BAD REQUEST', error))
    }

    await prisma.technician.delete({
      where: { id: value.id },
    })

    return res
      .status(200)
      .send(responseSuccess(200, 'DELETED', 'Technician deleted successfully'))
  } catch (err) {
    return res
      .status(500)
      .send(responseError(500, 'INTERNAL SERVER ERROR', err))
  }
}
