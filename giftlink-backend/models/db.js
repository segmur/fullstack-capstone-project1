// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url);      

    try {
        // Task 1: Connect to MongoDB
        await client.connect();
        console.log("Successfully connected to MongoDB.");
    
        // Task 2: Assign dbInstance
        dbInstance = client.db(dbName);
        
        // Task 3: Return dbInstance
        return dbInstance;
      } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err; // Re-throw the error to be handled by the calling function.
      }
}

module.exports = connectToDatabase;