require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const data = require('./data');

async function seed() {
  const uri = process.env.MONGO_URI;
  const dbName = "Cluster"; // Using "Cluster" as the database name

  if (!uri) {
    console.error("❌ MONGO_URI not found in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");

  const client = new MongoClient(uri, {
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
    console.log("✅ MongoDB connection established");

    const db = client.db(dbName);
    //const collection = db.collection('neighborhoods');
    const collection = db.collection('neighbourhoods');

    // Clear existing data
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} documents`);

    // Insert new data
    const result = await collection.insertMany(data);
    console.log(`🌱 Seeded ${result.insertedCount} neighborhoods`);

    // Verify data
    const count = await collection.countDocuments();
    console.log(`🔍 Total neighborhoods in database: ${count}`);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔒 MongoDB connection closed");
  }
}

seed();