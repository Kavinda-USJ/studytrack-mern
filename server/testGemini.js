require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('🔍 Fetching available models...\n');
    
    // Try to generate content with different model names
    const modelsToTry = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro',
      'models/gemini-pro'
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        console.log(`✅ ${modelName} WORKS!`);
        console.log(`Response: ${response.text().substring(0, 50)}...\n`);
        break; // Stop after first working model
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message.substring(0, 80)}...\n`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();