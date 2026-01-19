require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;

console.log('='.repeat(60));
console.log('🔍 GEMINI API MODEL TESTER');
console.log('='.repeat(60));
console.log('🔑 API Key Status:', API_KEY ? '✅ Found' : '❌ Not Found');
console.log('🔑 API Key Preview:', API_KEY ? `${API_KEY.substring(0, 20)}...` : 'N/A');
console.log('='.repeat(60));
console.log('');

if (!API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
  console.error('Please add GEMINI_API_KEY=your_key_here to your .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Models to test (in order of recommendation)
const modelsToTest = [
  { name: 'gemini-pro', description: 'Stable production model (RECOMMENDED)' },
  { name: 'gemini-1.5-flash', description: 'Fast, efficient model' },
  { name: 'gemini-1.5-pro', description: 'Advanced model with larger context' },
  { name: 'gemini-1.5-flash-latest', description: 'Latest flash version' },
  { name: 'gemini-1.5-pro-latest', description: 'Latest pro version' },
];

async function testModel(modelInfo) {
  const { name, description } = modelInfo;
  
  console.log(`\n📝 Testing: ${name}`);
  console.log(`   Description: ${description}`);
  
  try {
    const model = genAI.getGenerativeModel({ model: name });
    const result = await model.generateContent('Say "Hello! I am working." in one sentence.');
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ SUCCESS!`);
    console.log(`   Response: "${text.trim()}"`);
    console.log(`   ⭐ This model is working with your API key!`);
    
    return { name, success: true, response: text };
  } catch (error) {
    console.log(`❌ FAILED`);
    console.log(`   Error: ${error.message.substring(0, 150)}...`);
    
    return { name, success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting model tests...\n');
  console.log('-'.repeat(60));
  
  const results = [];
  
  for (const modelInfo of modelsToTest) {
    const result = await testModel(modelInfo);
    results.push(result);
    console.log('-'.repeat(60));
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const workingModels = results.filter(r => r.success);
  const failedModels = results.filter(r => !r.success);
  
  if (workingModels.length > 0) {
    console.log('\n✅ WORKING MODELS:');
    workingModels.forEach(m => {
      console.log(`   ⭐ ${m.name}`);
    });
    
    console.log('\n💡 RECOMMENDATION:');
    console.log(`   Use "${workingModels[0].name}" in your aiService.js`);
    console.log('');
    console.log('   Update this line in backend/services/aiService.js:');
    console.log(`   model = genAI.getGenerativeModel({ model: "${workingModels[0].name}" });`);
  } else {
    console.log('\n❌ NO WORKING MODELS FOUND');
    console.log('');
    console.log('Possible issues:');
    console.log('1. Invalid API key');
    console.log('2. API key not activated for Gemini');
    console.log('3. Billing not set up (if required)');
    console.log('4. Regional restrictions');
    console.log('');
    console.log('Solutions:');
    console.log('1. Get a new API key from: https://aistudio.google.com/app/apikey');
    console.log('2. Make sure Gemini API is enabled in Google Cloud Console');
  }
  
  if (failedModels.length > 0) {
    console.log('\n❌ FAILED MODELS:');
    failedModels.forEach(m => {
      console.log(`   - ${m.name}`);
    });
  }
  
  console.log('='.repeat(60));
}

// Run the tests
runTests().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});