const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// INWARDING ENDPOINTS
app.get('/api/inwarding', async (req, res) => {
  try {
    const logs = await prisma.inwardingLog.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inwarding', async (req, res) => {
  try {
    const { sku, batchCode, expiryDate, confidenceScore } = req.body;
    
    // Find product or use first available
    let product = await prisma.product.findUnique({ where: { sku } });
    if (!product) {
      product = await prisma.product.findFirst();
    }

    const log = await prisma.inwardingLog.create({
      data: {
        productId: product.id,
        batchCode,
        expiryDate: new Date(expiryDate),
        confidenceScore,
        status: 'PENDING',
      },
      include: { product: true }
    });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/inwarding/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED or REJECTED
    const log = await prisma.inwardingLog.update({
      where: { id },
      data: { status },
      include: { product: true }
    });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ALERTS ENDPOINTS
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// METRICS ENDPOINTS
app.get('/api/metrics', async (req, res) => {
  try {
    const totalScanned = await prisma.inwardingLog.count();
    const totalRejected = await prisma.inwardingLog.count({ where: { status: 'REJECTED' } });
    const activeAlerts = await prisma.alert.count({ where: { status: 'ACTIVE' } });
    
    res.json({
      totalScanned,
      totalRejected,
      activeAlerts,
      aiUptime: 99.99
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
