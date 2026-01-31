require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
console.log('🔑 Testing API Key:', apiKey?.substring(0, 20) + '...');
console.log('🔑 Key length:', apiKey?.length);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

async function test() {
  try {
    const result = await model.generateContent('Say hello in 3 words');
    console.log('✅ SUCCESS:', result.response.text());
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

test();
