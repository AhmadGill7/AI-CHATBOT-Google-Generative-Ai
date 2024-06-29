import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";


function App() {
  const API_KEY = process.env.REACT_APP_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(event) {
    event.preventDefault();

    const prompt = inputValue.trim();
    if (prompt === "") return;

    setMessages((prev) => [...prev, { type: "user", content: prompt }]);
    setInputValue("");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setMessages((prev) => [...prev, { type: "ai", content: text }]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium border rounded-full w-14 h-14 bg-black hover:bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
        type='button'
        aria-haspopup='dialog'
        aria-expanded={isOpen}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={24}
          height={24}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
          className='block'>
          <path d='m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z' />
        </svg>
      </button>
      {isOpen && (
        <div className='fixed bottom-20 right-4 bg-white p-6 rounded-lg border border-gray-200 shadow-xl w-96 max-h-[80vh] flex flex-col transition-all duration-300 ease-in-out transform scale-100 opacity-100'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='font-semibold text-lg text-gray-800'>Chatbot</h2>
            <p className='text-sm text-gray-500'>
              Powered by Google Generative Ai
            </p>
            <p className='text-sm text-gray-500'>
              AI Integration and App Designed By Ahmad Gill
            </p>
          </div>
          <div
            ref={chatContainerRef}
            className='flex-grow overflow-y-auto mb-4 space-y-4'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  <p className='text-sm'>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className='flex items-center space-x-2'>
            <input
              id='query'
              className='flex-grow h-10 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Type your message'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type='submit'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 h-10 px-4 py-2 transition-colors duration-300'>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
