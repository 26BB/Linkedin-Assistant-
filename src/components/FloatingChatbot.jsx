import React, { useState, useEffect, useRef } from 'react';
import { listMcpTools, callMcpTool } from '../services/mcpClient';
import { chatWithMcp } from '../services/aiApi';


const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const tools = await listMcpTools();
      let aiResponse = await chatWithMcp(newMessages, tools);

      if (aiResponse.message.tool_calls && aiResponse.message.tool_calls.length > 0) {
        const toolCall = aiResponse.message.tool_calls[0];
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        setMessages(prev => [...prev, aiResponse.message, { role: 'tool', content: `[Running tool: ${functionName}...]` }]);

        let result;
        try {
          result = await callMcpTool(functionName, functionArgs);
        } catch (e) {
          result = { error: e.message };
        }

        const toolMessage = {
          role: 'tool',
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(result)
        };

        const followupMessages = [...newMessages, aiResponse.message, toolMessage];
        const finalResponse = await chatWithMcp(followupMessages, tools);

        setMessages(prev => [...prev.slice(0, -1), finalResponse.message]);
      } else {
        setMessages(prev => [...prev, aiResponse.message]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[99999]">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-14 h-14 bg-anthracite dark:bg-white text-white dark:text-anthracite rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">chat_bubble</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-[500px] max-h-[80vh] bg-white dark:bg-[#1e1e1c] rounded-2xl shadow-2xl border border-[#b1b3a9]/20 dark:border-white/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-anthracite dark:bg-black text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h3 className="font-bold text-sm">LinkedIn AI Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#fbf9f4] dark:bg-[#0e0e0c]">
            {messages.length === 0 && (
              <div className="text-center text-[#5e6058] dark:text-[#9e9d99] text-xs mt-10">
                Ask me anything about your LinkedIn profile, feed, or analytics using the local MCP server!
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-anthracite text-white rounded-br-none self-end'
                    : 'bg-white dark:bg-[#1e1e1c] border border-[#b1b3a9]/20 dark:border-white/10 text-anthracite dark:text-white rounded-bl-none self-start'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white dark:bg-[#1e1e1c] border border-[#b1b3a9]/20 dark:border-white/10 text-anthracite dark:text-white rounded-2xl rounded-bl-none px-4 py-3 self-start max-w-[85%] flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-[#5e6058] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#5e6058] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#5e6058] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-[#1e1e1c] border-t border-[#b1b3a9]/20 dark:border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your feed..."
              className="flex-1 bg-[#f5f4ed] dark:bg-[#2a2a28] rounded-xl px-3 py-2 text-sm outline-none text-anthracite dark:text-white placeholder-[#9e9d99]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 bg-anthracite dark:bg-white text-white dark:text-anthracite rounded-xl flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
