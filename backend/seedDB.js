// backend/seedDB.js
require('dotenv').config();
const { MongoClient } = require('mongodb');
const data = require('./data'); // Your updated data file

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db("Cluster");
    const collection = db.collection("neighborhoods");

    // Clear existing data (optional)
    await collection.deleteMany({});

    // Insert new data
    const result = await collection.insertMany(data);
    console.log(`✅ Successfully inserted ${result.insertedCount} neighborhoods`);
  } finally {
    await client.close();
  }
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});