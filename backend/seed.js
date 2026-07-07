const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if already seeded
  const existingProduct = await prisma.product.findFirst();
  if (existingProduct) {
    console.log("Database already seeded");
    return;
  }

  // Create products
  const product1 = await prisma.product.create({
    data: {
      sku: 'SKU-8842-DAIRY',
      name: 'Organic Whole Milk',
      supplier: 'Valley Creek Farms',
    }
  });

  const product2 = await prisma.product.create({
    data: {
      sku: 'SKU-1092-PROD',
      name: 'Fresh Strawberries',
      supplier: 'Sunrise Agritech',
    }
  });

  // Create Inwarding Logs
  await prisma.inwardingLog.create({
    data: {
      productId: product1.id,
      batchCode: 'LOT: L99320-A',
      expiryDate: new Date('2024-10-24T00:00:00Z'),
      confidenceScore: 98.4,
      status: 'PENDING',
      cameraSource: 'CAM_04_NORTH'
    }
  });
  
  await prisma.inwardingLog.create({
    data: {
      productId: product2.id,
      batchCode: 'LOT: F992-B',
      expiryDate: new Date('2024-11-05T00:00:00Z'),
      confidenceScore: 91.2,
      status: 'APPROVED',
      cameraSource: 'CAM_02_SOUTH'
    }
  });

  // Create Alerts
  await prisma.alert.create({
    data: {
      type: 'ANOMALY',
      severity: 'HIGH',
      message: 'Packaging seal integrity alert on Batch #2293. AI vision detected micro-tears in the plastic substrate.',
      status: 'ACTIVE'
    }
  });

  await prisma.alert.create({
    data: {
      type: 'TEMPERATURE',
      severity: 'CRITICAL',
      message: 'Zone C cold storage breached 4°C threshold for 15 minutes.',
      status: 'ACTIVE'
    }
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
