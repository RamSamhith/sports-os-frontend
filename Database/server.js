require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
        console.log("Database:", mongoose.connection.name);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testConnection();