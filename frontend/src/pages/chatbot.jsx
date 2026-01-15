import React, { useState, useEffect, useRef } from 'react';

// --- Placeholder Components ---
// These are simple placeholders to fix the "Could not resolve" error.
// You should replace these with your actual component imports.
const NavScrollExample = () => {
  return (
    <nav style={{ background: '#f8f9fa', padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>Navbar Placeholder</p>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer style={{ background: '#f8f9fa', padding: '1rem', textAlign: 'center', borderTop: '1px solid #dee2e6', marginTop: '2rem' }}>
      <p style={{ margin: 0 }}>Footer Placeholder</p>
    </footer>
  );
};
// ------------------------------


// This component assumes Bootstrap CSS is loaded in your project's main HTML file.
// For example: <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

const FarmerChatbot = () => {
  // State to hold the chat messages
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you with farming today?" }
  ]);
  // State for the user's input
  const [input, setInput] = useState("");
  // State to track if the bot is typing
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any error messages
  const [error, setError] = useState(null); // FIXED: This was missing

  // Ref for the chat container to enable auto-scrolling
  const chatContainerRef = useRef(null);
  // Ref for the end of the chat list, for auto-scrolling
  const chatEndRef = useRef(null); // FIXED: This was missing

  // Effect to scroll to the bottom of the chat on new messages (using chatContainerRef)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Send Message Handler ---
  // FIXED: Renamed to handleSend and used for the form's onSubmit
  const handleSend = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    if (!input.trim() || isLoading) return; // Don't send empty or if already loading

    const userMessage = { sender: 'user', text: input };
    
    // Add user's message to the chat
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input; // Store input before clearing
    setInput(''); // Clear the input box
    setIsLoading(true); // Show loading indicator
    setError(null); // Clear previous errors

    try {
      // Make the API call to our Flask backend
      // Make sure your Flask server is running on http://127.0.0.1:5000
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentInput }), // Send the user's input as 'prompt'
      });

      if (!response.ok) {
        // Handle HTTP errors (like 500, 404)
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      
      // Create the bot's response message
      const botMessage = { sender: 'bot', text: data.response };
      // Add bot's message to the chat
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error("Error fetching from backend:", err);
      // Show a user-friendly error message in the chat
      setError(`Sorry, I'm having trouble connecting. Error: ${err.message}`);
      // You could also add this as a 'bot' message:
      // const errorMessage = { sender: 'bot', text: `Error: ${err.message}` };
      // setMessages(prev => [...prev, errorMessage]);
    } finally {
      // Whether successful or not, stop loading
      setIsLoading(false);
    }
  };


  // --- JSX for Rendering the Component with Bootstrap ---
  return (
    <div>
      <NavScrollExample /> {/* FIXED: Added component back */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}> {/* Adjusted height for footer/nav */}
        <div className="card shadow-lg" style={{ width: "100%", maxWidth: "700px", height: "80vh", display: 'flex', flexDirection: 'column' }}>
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">👨‍🌾 Farmer Chatbot</h4>
          </div>

          <div
            ref={chatContainerRef}
            className="card-body p-4"
            style={{ flexGrow: 1, overflowY: "auto" }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div
                  className={`p-3 rounded-3 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                  style={{ maxWidth: '75%', whiteSpace: 'pre-wrap' }} // Added pre-wrap
                >
                  <p className="mb-0">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="d-flex justify-content-start">
                <div className="p-3 rounded-3 bg-light text-dark">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="d-flex justify-content-center">
                <div className="alert alert-danger p-2" role="alert">
                  {error}
                </div>
              </div>
            )}
            
            {/* This empty div is what chatEndRef would point to if you used it */}
            <div ref={chatEndRef} />
          </div>

          <div className="card-footer p-3">
            {/* FIXED: Changed to a form and hooked up onSubmit */}
            <form onSubmit={handleSend} className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Ask your farming question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                aria-label="Your message"
              />
              <button
                className="btn btn-success"
                type="submit" // FIXED: Changed to type="submit"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default FarmerChatbot;