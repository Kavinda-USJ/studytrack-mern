require('dotenv').config();
const mongoose = require('mongoose');

async function testMongo() {
  console.log('🔍 Testing MongoDB Connection...');
  console.log('📝 Connection String:', process.env.MONGO_URI?.substring(0, 50) + '...');
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ SUCCESS! MongoDB Connected:', conn.connection.host);
    await mongoose.connection.close();
    console.log('✅ Connection closed gracefully');
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

testMongo();
