const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Seed warehouse admins
  const warehouseAdmin1 = await prisma.warehouseAdmin.create({
    data: {
      name: 'John Doe',
      username: 'johndoe',
      password: 'password',
    },
  })

  const warehouseAdmin2 = await prisma.warehouseAdmin.create({
    data: {
      name: 'Jane Smith',
      username: 'janesmith',
      password: 'password',
    },
  })

  // Seed technicians
  const technician1 = await prisma.technician.create({
    data: { nik: 'T001', name: 'Bob Johnson' },
  })

  const technician2 = await prisma.technician.create({
    data: { nik: 'T002', name: 'Alice Lee' },
  })

  // Seed stocks
  const stock1 = await prisma.stock.create({
    data: { name: 'Widget A', quantity: 100 },
  })

  const stock2 = await prisma.stock.create({
    data: { name: 'Widget B', quantity: 50 },
  })

  // Seed stock transfers
  const stockTransfer1 = await prisma.stockTransfer.create({
    data: {
      date: new Date('2023-05-01T00:00:00Z'),
      warehouseAdmin: { connect: { id: warehouseAdmin1.id } },
      technician: { connect: { id: technician1.id } },
      nik: 'ST0001',
      details: {
        create: [
          { stock: { connect: { id: stock1.id } }, quantity: 50 },
          { stock: { connect: { id: stock2.id } }, quantity: 20 },
        ],
      },
    },
  })

  const stockTransfer2 = await prisma.stockTransfer.create({
    data: {
      date: new Date('2023-05-15T00:00:00Z'),
      warehouseAdmin: { connect: { id: warehouseAdmin2.id } },
      technician: { connect: { id: technician2.id } },
      nik: 'ST0002',
      details: {
        create: [
          { stock: { connect: { id: stock1.id } }, quantity: 30 },
          { stock: { connect: { id: stock2.id } }, quantity: 10 },
        ],
      },
    },
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
