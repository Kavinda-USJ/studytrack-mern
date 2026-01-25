import { useState } from 'react';
import { askAI, testAI } from '../Services/aiService';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');

  const handleTest = async () => {
    console.log('🧪 Testing AI...');
    setStatus('Testing AI connection...');
    setStatusType('info');
    try {
      const result = await testAI();
      setStatus(`✅ ${result.message}`);
      setStatusType('success');
      console.log('✅ Test successful:', result);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus(`❌ Test failed: ${error.message}`);
      setStatusType('error');
      console.error('❌ Test failed:', error);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      console.log('⚠️ Empty question');
      return;
    }

    console.log('📤 Sending question:', question);
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);
    setStatus('AI is thinking...');
    setStatusType('info');

    try {
      const response = await askAI(question, subject || null);
      
      console.log('✅ AI Response received:', response);
      
      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: response.data.answer 
      }]);
      
      setStatus('');
      setQuestion('');
      
    } catch (error) {
      console.error('❌ Error:', error);
      setStatus(`❌ Error: ${error.message}`);
      setStatusType('error');
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `Sorry, I encountered an error: ${error.message}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setQuestion('');
    setSubject('');
    setStatus('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6 md:p-8 mt-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Study Assistant</h2>
            <p className="text-sm text-gray-400">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleTest}
            className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all border border-green-500/30 text-sm"
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            Test API
          </button>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30 text-sm"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
            statusType === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : statusType === 'error'
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
          }`}
        >
          {statusType === 'success' && <CheckCircle className="w-4 h-4" />}
          {statusType === 'error' && <XCircle className="w-4 h-4" />}
          {statusType === 'info' && <Loader2 className="w-4 h-4 animate-spin" />}
          <span className="text-sm">{status}</span>
        </motion.div>
      )}

      {/* Chat Messages */}
      <div className="bg-white/5 rounded-xl p-4 mb-4 h-96 overflow-y-auto border border-white/10 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-400 mb-2">👋 Ask me anything about your studies!</p>
            <p className="text-sm text-gray-500">
              Example: "Explain photosynthesis" or "Give me study tips for math"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-gray-200 border border-white/20'
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {msg.role === 'user' ? 'You' : '🤖 AI Assistant'}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 p-3 rounded-lg border border-white/20 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span className="text-sm text-gray-400">AI is thinking...</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleAsk} className="space-y-3">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (optional, e.g., Math, Physics, History)"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything about your studies..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              loading || !question.trim()
                ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Ask
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Suggestions */}
      {messages.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <p className="text-xs text-gray-500 w-full mb-2">Quick suggestions:</p>
          {[
            "Explain photosynthesis",
            "Study tips for Math",
            "What is Newton's First Law?",
            "Help me understand algebra"
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setQuestion(suggestion)}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-lg border border-white/10 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AIAssistant;