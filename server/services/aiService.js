// backend/services/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAcyf9nRQUGktTuT2L-f7we_0e5Rilw1_I";

console.log('🔧 AI Service Loading...');
console.log('🔑 Gemini API Key loaded:', !!GEMINI_API_KEY);
console.log('🔑 API Key first 20 chars:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 20) + '...' : 'NOT SET');

// Initialize Gemini AI
let genAI;
let model;

try {
  console.log('🚀 Initializing Google Generative AI...');
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log('✅ GoogleGenerativeAI instance created');
  
  // Use gemini-2.5-flash (your available model)
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  console.log('✅ Gemini model initialized: gemini-2.5-flash');
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI:', error.message);
  console.error('❌ Error stack:', error.stack);
}

/**
 * Generate AI response using Gemini
 */
const generateAIResponse = async (prompt) => {
  try {
    console.log('\n🤖 ========== AI RESPONSE GENERATION START ==========');
    console.log('📝 Prompt length:', prompt.length, 'characters');
    console.log('📝 Prompt preview:', prompt.substring(0, 150) + '...');
    console.log('⏰ Timestamp:', new Date().toISOString());

    if (!model) {
      console.error('❌ Model not initialized!');
      throw new Error('Gemini model not initialized');
    }

    console.log('📤 Sending request to Gemini API...');
    const startTime = Date.now();

    const result = await model.generateContent(prompt);
    
    const responseTime = Date.now() - startTime;
    console.log('⏱️ API Response time:', responseTime, 'ms');
    console.log('📥 Raw result received:', typeof result);

    const response = await result.response;
    console.log('📥 Response object extracted');

    const text = response.text();
    console.log('✅ Response text length:', text.length, 'characters');
    console.log('✅ Response preview:', text.substring(0, 100) + '...');
    console.log('🤖 ========== AI RESPONSE GENERATION END ==========\n');

    return text.trim();

  } catch (error) {
    console.error('\n❌ ========== AI RESPONSE ERROR ==========');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    console.error('❌ ========== ERROR END ==========\n');
    throw new Error('Failed to generate AI response: ' + error.message);
  }
};

/**
 * Generate AI chat response with conversation history
 */
const generateChatResponse = async (messages) => {
  try {
    console.log('\n💬 ========== CHAT RESPONSE GENERATION START ==========');
    console.log('📨 Number of messages:', messages.length);
    console.log('📨 Messages:', JSON.stringify(messages, null, 2));

    // Convert messages to Gemini format
    const chatHistory = messages.map((msg, index) => {
      console.log(`📝 Message ${index + 1}: ${msg.role} - ${(msg.text || msg.content || '').substring(0, 50)}...`);
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text || msg.content || '' }]
      };
    });

    console.log('🔄 Converted to Gemini format:', chatHistory.length, 'messages');

    // For chat, we'll use the last message as prompt with context
    const lastMessage = messages[messages.length - 1];
    const contextMessages = messages.slice(0, -1).map(m => 
      `${m.role}: ${m.text || m.content}`
    ).join('\n');

    let fullPrompt = '';
    if (contextMessages) {
      fullPrompt = `Previous conversation:\n${contextMessages}\n\nCurrent question: ${lastMessage.text || lastMessage.content}`;
    } else {
      fullPrompt = lastMessage.text || lastMessage.content;
    }

    console.log('📝 Full prompt with context:', fullPrompt.substring(0, 200) + '...');

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Chat response generated:', text.substring(0, 100) + '...');
    console.log('💬 ========== CHAT RESPONSE GENERATION END ==========\n');

    return text.trim();

  } catch (error) {
    console.error('\n❌ ========== CHAT RESPONSE ERROR ==========');
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    console.error('❌ ========== ERROR END ==========\n');
    throw new Error('Failed to generate chat response: ' + error.message);
  }
};

// Test function to verify API is working
const testGeminiAPI = async () => {
  try {
    console.log('\n🧪 ========== TESTING GEMINI API ==========');
    const testPrompt = "Say 'Gemini API is working correctly!' if you can read this.";
    const response = await generateAIResponse(testPrompt);
    console.log('✅ Test successful! Response:', response);
    console.log('🧪 ========== TEST END ==========\n');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
};

// Run test on initialization
if (model) {
  testGeminiAPI();
}

module.exports = {
  generateAIResponse,
  generateChatResponse,
  testGeminiAPI
};