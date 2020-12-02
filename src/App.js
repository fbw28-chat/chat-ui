import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {

  const chatHistoryRef = useRef([
    { text: "Hey", user: "Rob" },
    { text: "Hi Rob", user: "Bob" },
  ])

  // initialize connection on load
  useEffect(() => {

    // listen for incoming messages AFTER connection is setup

    // Clean up on unmounting
    return () => {}

  }, [])

  // create JSX list from chat history entries
  let jsxChatHistory = chatHistoryRef.current.map((chatMsg, i) => (
    <div className="chat-msg" key={i}>
      <label>{chatMsg.user}:</label>
      <span>{chatMsg.text}</span>
    </div>
  ))

  return (
    <div className="App">
      <header className="App-header">
        <h2>Chat</h2>
        <div id="chat-area">{jsxChatHistory}</div>
        <form id="message-send" >
          <input 
            autoComplete="off"
            name="message-new" 
            placeholder={`Type your message...`} />
          <button type="submit" >Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
