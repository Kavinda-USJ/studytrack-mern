const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateAIResponse } = require('../services/aiService');

/**
 * @route   GET /api/ai/test
 * @desc    Test if Gemini API is working
 * @access  Public
 */
router.get('/test', async (req, res) => {
  try {
    console.log('\n🧪 ========== /api/ai/test ENDPOINT CALLED ==========');
    
    const testPrompt = "Respond with 'Gemini API is working!' if you receive this message.";
    const response = await generateAIResponse(testPrompt);
    
    console.log('✅ Test successful');
    console.log('🧪 ========== /api/ai/test ENDPOINT END ==========\n');
    
    res.status(200).json({
      success: true,
      message: 'Gemini API is working!',
      response: response
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gemini API test failed',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/ask
 * @desc    Ask AI a question (Study Assistant)
 * @access  Public
 */
router.post('/ask', async (req, res) => {
  try {
    console.log('\n🎯 ========== /api/ai/ask ENDPOINT CALLED ==========');
    console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
    
    const { question, subject, context } = req.body;

    // Validate input
    if (!question) {
      console.log('⚠️ Missing question in request');
      return res.status(400).json({ 
        success: false, 
        message: 'Question is required' 
      });
    }

    console.log('✅ Question received:', question);
    console.log('📚 Subject:', subject || 'Not specified');
    console.log('📝 Context:', context || 'Not provided');

    // Build the prompt for Gemini
    let prompt = `You are a helpful study assistant for students. `;
    
    if (subject) {
      prompt += `The student is studying ${subject}. `;
    }
    
    if (context) {
      prompt += `Context: ${context}. `;
    }
    
    prompt += `Student's question: ${question}\n\n`;
    prompt += `Provide a clear, concise, and educational answer suitable for students.`;

    console.log('📝 Final prompt created');

    // Get AI response
    console.log('🚀 Calling generateAIResponse...');
    const aiResponse = await generateAIResponse(prompt);
    
    console.log('✅ AI Response received');

    const responseData = {
      success: true,
      data: {
        question,
        answer: aiResponse,
        subject: subject || 'General',
      }
    };

    console.log('📤 Sending response to client');
    console.log('🎯 ========== /api/ai/ask ENDPOINT END ==========\n');

    res.status(200).json(responseData);

  } catch (error) {
    console.error('\n❌ ========== /api/ai/ask ERROR ==========');
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    console.error('❌ ========== ERROR END ==========\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/breakdown-task
 * @desc    Break down a large task into smaller subtasks
 * @access  Private
 */
router.post('/breakdown-task', protect, async (req, res) => {
  try {
    console.log('\n📋 ========== /api/ai/breakdown-task ENDPOINT CALLED ==========');
    console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
    
    const { taskTitle, subject, deadline } = req.body;

    if (!taskTitle) {
      console.log('⚠️ Missing taskTitle');
      return res.status(400).json({ 
        success: false, 
        message: 'Task title is required' 
      });
    }

    // Build prompt
    let prompt = `You are a study planning assistant. Break down this task into 4-6 smaller, actionable subtasks:\n\n`;
    prompt += `Task: ${taskTitle}\n`;
    
    if (subject) {
      prompt += `Subject: ${subject}\n`;
    }
    
    if (deadline) {
      prompt += `Deadline: ${deadline}\n`;
    }
    
    prompt += `\nProvide the subtasks as a simple numbered list. Each subtask should be specific and achievable.`;

    console.log('📝 Prompt created for task breakdown');
    const aiResponse = await generateAIResponse(prompt);
    
    console.log('✅ Task breakdown complete');
    console.log('📋 ========== /api/ai/breakdown-task ENDPOINT END ==========\n');

    res.status(200).json({
      success: true,
      data: {
        originalTask: taskTitle,
        subtasks: aiResponse,
        subject: subject || 'General',
      }
    });

  } catch (error) {
    console.error('\n❌ Task Breakdown Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to break down task',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/study-tips
 * @desc    Get personalized study tips based on subject
 * @access  Private
 */
router.post('/study-tips', protect, async (req, res) => {
  try {
    console.log('\n💡 ========== /api/ai/study-tips ENDPOINT CALLED ==========');
    console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
    
    const { subject, topic, studyTime } = req.body;

    let prompt = `You are a study coach. Provide 3-5 effective study tips for:\n`;
    
    if (subject) {
      prompt += `Subject: ${subject}\n`;
    }
    
    if (topic) {
      prompt += `Specific Topic: ${topic}\n`;
    }
    
    if (studyTime) {
      prompt += `Available Study Time: ${studyTime} minutes\n`;
    }
    
    prompt += `\nMake the tips practical, actionable, and specific to this subject/topic.`;

    console.log('📝 Prompt created for study tips');
    const aiResponse = await generateAIResponse(prompt);
    
    console.log('✅ Study tips generated');
    console.log('💡 ========== /api/ai/study-tips ENDPOINT END ==========\n');

    res.status(200).json({
      success: true,
      data: {
        tips: aiResponse,
        subject: subject || 'General',
      }
    });

  } catch (error) {
    console.error('\n❌ Study Tips Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get study tips',
      error: error.message
    });
  }
});

module.exports = router;