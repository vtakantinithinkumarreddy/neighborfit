require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { calculateScores } = require('./algorithm');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend build (React)
app.use(express.static(path.join(__dirname, 'build')));

// MongoDB Configuration
async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 15000,
    socketTimeoutMS: 30000
  });

  try {
    await client.connect();
    console.log('✅ MongoDB connected');
    return client;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

async function startServer() {
  const client = await connectDB();
  const db = client.db('Cluster');

  // Matching Endpoint
  app.post('/api/find-neighborhoods', async (req, res) => {
    try {
      console.log('Received preferences:', req.body);
      const { safety = 0.5, amenities = 0.5, affordability = 0.5 } = req.body;
      const collection = db.collection('neighbourhoods');

      if (
        typeof safety !== 'number' ||
        typeof amenities !== 'number' ||
        typeof affordability !== 'number'
      ) {
        return res.status(400).json({ success: false, error: 'Invalid preference values' });
      }

      const neighborhoods = await collection.find({
        crimeRate: { $exists: true, $type: 'number', $gte: 0, $lte: 10 },
        amenities: { $exists: true, $type: 'number', $gte: 0, $lte: 10 },
        priceIndex: { $exists: true, $type: 'number', $gte: 0, $lte: 10 }
      }).toArray();

      console.log(`Found ${neighborhoods.length} valid neighborhoods`);

      if (!neighborhoods.length) {
        return res.status(404).json({
          success: false,
          message: 'No neighborhoods found with required data'
        });
      }

      const matches = calculateScores(
        { safety, amenities, cost: affordability },
        neighborhoods
      ).slice(0, 5);

      console.log('Top matches:', matches.map(m => ({ name: m.name, score: m.matchScore })));

      const results = await Promise.all(
        matches.map(async match => {
          const neighbors = await collection.find({
            _id: { $in: match.neighborIds || [] }
          }).project({
            name: 1,
            crimeRate: 1,
            amenities: 1,
            priceIndex: 1,
            transitScore: 1,
            neighborIds: 1
          }).toArray();

          return {
            ...match,
            neighbors: neighbors.map(n => ({
              id: n._id,
              name: n.name,
              safety: Math.round((1 - (n.crimeRate / 10)) * 100),
              amenities: Math.round((n.amenities / 10) * 100),
              affordability: Math.round((1 - (n.priceIndex / 10)) * 100),
              transit: n.transitScore ? Math.round(n.transitScore) : 'N/A',
              neighborIds: n.neighborIds
            }))
          };
        })
      );

      res.json({
        success: true,
        matches: results,
        debug: process.env.NODE_ENV === 'development' ? {
          preferences: { safety, amenities, affordability },
          neighborhoodsCount: neighborhoods.length
        } : undefined
      });

    } catch (error) {
      console.error('Matching error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Basic neighborhood list endpoint
  app.get('/api/neighbourhoods', async (req, res) => {
    try {
      const data = await db.collection('neighbourhoods').find({}).toArray();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Serve React frontend (for all unmatched routes)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
