const API_URL = 'http://localhost:3001/api/ai';

// Test AI connection
export const testAI = async () => {
  try {
    console.log('🧪 Testing AI connection...');
    const response = await fetch(`${API_URL}/test`);
    const data = await response.json();
    console.log('✅ AI Test Response:', data);
    return data;
  } catch (error) {
    console.error('❌ AI Test Error:', error);
    throw error;
  }
};

// Ask AI a question
export const askAI = async (question, subject = null, context = null) => {
  try {
    console.log('📤 Asking AI:', { question, subject, context });
    
    const response = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, subject, context })
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ AI Error Response:', errorData);
      throw new Error(errorData.message || 'Failed to get AI response');
    }

    const data = await response.json();
    console.log('✅ AI Response:', data);
    return data;

  } catch (error) {
    console.error('❌ Ask AI Error:', error);
    throw error;
  }
};

// Break down task
export const breakdownTask = async (taskTitle, subject = null, deadline = null, token = null) => {
  try {
    console.log('📋 Breaking down task:', { taskTitle, subject, deadline });
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/breakdown-task`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ taskTitle, subject, deadline })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Breakdown Error:', errorData);
      throw new Error(errorData.message || 'Failed to breakdown task');
    }

    const data = await response.json();
    console.log('✅ Task Breakdown:', data);
    return data;

  } catch (error) {
    console.error('❌ Breakdown Task Error:', error);
    throw error;
  }
};

// Get study tips
export const getStudyTips = async (subject = null, topic = null, studyTime = null, token = null) => {
  try {
    console.log('💡 Getting study tips:', { subject, topic, studyTime });
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/study-tips`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subject, topic, studyTime })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Study Tips Error:', errorData);
      throw new Error(errorData.message || 'Failed to get study tips');
    }

    const data = await response.json();
    console.log('✅ Study Tips:', data);
    return data;

  } catch (error) {
    console.error('❌ Get Study Tips Error:', error);
    throw error;
  }
};