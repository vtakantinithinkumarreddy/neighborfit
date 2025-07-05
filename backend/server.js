// backend/server.js
//const { calculateScores } = require('./algorithm');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { calculateScores } = require('./algorithm'); // Import the function

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and Collection names
const DB_NAME = "Cluster";
const COLLECTION_NAME = "neighborhoods";

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    
    app.post('/api/match', async (req, res) => {
      try {
        const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
        const neighborhoods = await collection.find().toArray();
        
        if (!neighborhoods.length) {
          return res.status(404).json({ error: "No neighborhoods found" });
        }

        const results = calculateScores(req.body, neighborhoods);
        res.json(results);
      } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });

  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

run().catch(console.error);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', async () => {
  await client.close();
  process.exit(0);
});