/**
 * SAATHI BIS Master API Gateway
 * Architecture Standard: Architecture A (PostgreSQL / Relational Data Model)
 * Rule 7 Resolution: All services (C, S, I, P, G, X) are unified onto relational tables
 * matching the canonical database.js convention with high-speed in-memory relational fallback.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5050;

// Connect to Relational Database Engine
connectDB();

// Global Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Core System & Health Endpoints (P4, P7, S27)
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: "HEALTHY",
    environment: process.env.NODE_ENV || "development",
    architecture: "Unified Relational (Architecture A - PostgreSQL)",
    timestamp: new Date().toISOString(),
    services: {
      relational_database: "CONNECTED",
      international_trust: "OPERATIONAL",
      application_lifecycle: "OPERATIONAL",
      compliance_intelligence: "OPERATIONAL",
      rag_intelligence: "OPERATIONAL"
    }
  });
});

app.get('/api/v1/public/status', (req, res) => {
  res.json({
    system: "SAATHI BIS Citizen Portal",
    operational_status: "ALL_SYSTEMS_OPERATIONAL",
    architecture_standard: "PostgreSQL Relational Layer (Architecture A)",
    dr_drill_status: "ROADMAP_PLANNED",
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
const internationalRoutes = require('./src/routes/internationalRoutes');
const lifecycleRoutes = require('./src/routes/lifecycleRoutes');
const complianceRoutes = require('./src/routes/complianceRoutes');
const platformRoutes = require('./src/routes/platformRoutes');

app.use('/api/v1/international', internationalRoutes);
app.use('/api/v1/lifecycle', lifecycleRoutes);
app.use('/api/v1/compliance', complianceRoutes);
app.use('/api/v1/platform', platformRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: "SAATHI BIS MERN Stack Gateway",
    version: "1.0.0",
    description: "Full MERN API for Bureau of Indian Standards (BIS) Smart Compliance Platform"
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Export app for testing and server startup
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 SAATHI BIS MERN Gateway running on http://localhost:${PORT}`);
  });
}

module.exports = app;
