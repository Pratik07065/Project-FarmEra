import React, { useState, useRef, useEffect } from 'react';

// SVG component for the Send button icon
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.478 21.429 20.9 12.028l-17.422-9.4A1.02 1.02 0 0 0 2 3.499v5.996l7.5 1.513-7.5 1.513v5.996a1.02 1.02 0 0 0 1.478.912Z" />
    </svg>
);

// This is the main component for your React application
function AgricultureChatbot() {
    // State to hold the list of all chat messages
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: "Welcome to AgriBot! How can I help you with your agriculture questions today?"
        }
    ]);
    // State for the user's current input
    const [input, setInput] = useState('');
    // State to show a loading indicator while the bot is replying
    const [isLoading, setIsLoading] = useState(false);
    // State to store any error messages
    const [error, setError] = useState(null);

    // A ref to the end of the chat list, to auto-scroll
    const chatEndRef = useRef(null);

    // This effect runs every time the 'messages' array changes
    // It smoothly scrolls to the bottom of the chat window
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handles the submission of the input form (when user hits Send)
    const handleSend = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        if (!input.trim() || isLoading) return; // Don't send empty or if already loading

        const userMessage = { sender: 'user', text: input };

        // Add user's message to the chat
        setMessages(prev => [...prev, userMessage]);
        setInput(''); // Clear the input box
        setIsLoading(true); // Show loading indicator
        setError(null); // Clear previous errors

        try {
            // Make the API call to our Flask backend
            // Make sure your Flask server is running on http://127.0.0.1:5000
            const response = await fetch('http://127.0.0.1:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input }), // Send the user's input as 'prompt'
            });

            if (!response.ok) {
                // Handle HTTP errors (like 500, 404)
                const errorData = await response.json();
                throw new Error(errorData.error || Server responded with ${ response.status });
            }

            const data = await response.json();

            // Create the bot's response message
            const botMessage = { sender: 'bot', text: data.response };
            // Add bot's message to the chat
            setMessages(prev => [...prev, botMessage]);

        } catch (err) {
            console.error("Error fetching from backend:", err);
            // Show a user-friendly error message in the chat
            setError("Sorry, I'm having trouble connecting. Please check if the backend server is running and try again.");
            // You could also add this as a 'bot' message:
            // const errorMessage = { sender: 'bot', text: Error: ${err.message} };
            // setMessages(prev => [...prev, errorMessage]);
        } finally {
            // Whether successful or not, stop loading
            setIsLoading(false);
        }
    };

    return (
      
            <div className="flex flex-col h-screen bg-green-50 font-sans">
                {/* Header */}
                <header className="bg-green-700 text-white p-4 text-center shadow-md z-10">
                    <h1 className="text-2xl font-bold">🌱 AgriBot Chat</h1>
                </header>

                {/* Chat Messages Area */}
                <main className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}}>
                    <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none'
                            }`}
                    >
                        {/* We use whitespace-pre-wrap to respect newlines from the AI */}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
            </div>
        ))}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-bl-none shadow">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message Display */}
            {error && (
                <div className="flex justify-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Empty div to which we scroll */}
            <div ref={chatEndRef} />
        </main>

      {/* Input Form Area */ }
    <footer className="bg-white p-4 shadow-inner border-t border-gray-200">
        <form onSubmit={handleSend} className="flex space-x-3">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about farming..."
                className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
                autoFocus
            />
            <button
                type="submit"
                className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
            >
                <SendIcon />
            </button>
        </form>
    </footer>
    </div >

  );
}

// This is the standard way to export the main component
export default AgricultureChatbot;