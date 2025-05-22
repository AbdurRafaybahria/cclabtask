const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method is allowed" });
  }

  // Get data from request body
  let { name, email } = req.body;
  
  // Validate input
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  // Get MongoDB connection string
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error("MONGODB_URI environment variable is not set");
    return res.status(500).json({ message: "Server configuration error" });
  }

  // Connect to MongoDB
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Access the database and collection
    const db = client.db("studentsDB");
    const collection = db.collection("users");

    // Insert the document
    const result = await collection.insertOne({
      name,
      email,
      timestamp: new Date()
    });

    console.log(`User added with ID: ${result.insertedId}`);
    res.status(200).json({ message: "User added successfully!", userId: result.insertedId });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  } finally {
    // Close the connection
    await client.close();
    console.log("MongoDB connection closed");
  }
};
