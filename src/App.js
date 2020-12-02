import './App.css';
import { useEffect, useRef, useState } from 'react';
import socketIo from 'socket.io-client'
import faker from 'faker'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000" 

function App() {

  // const variable = "hello"; // this does not work as global variable

  const socketRef = useRef() // global object for a component
  const chatHistoryRef = useRef([
    { text: "Hey", user: "Rob" },
    { text: "Hi Rob", user: "Bob" },
  ]) // chatHistoryRef.current => [...]
  const msgRef = useRef("")
  const [userName, setUserName] = useState( faker.name.firstName() ) 
  const [rerender, setRerender] = useState(0)

  // initialize connection on load
  useEffect(() => {

    socketRef.current = socketIo(API_URL) // create an instance of a socket client
    let socket = socketRef.current

    // listen for incoming messages AFTER connection is setup
    socket.on("message", (chatEntry) => {
      console.log(chatEntry)
      addMsgToHistory(chatEntry) // add incoming to message to history
      triggerRerender() // force update of the DOM
    })

    // Clean up on unmounting
    return () => {
      socket.disconnect() // close socket connection
    }

  }, [])


  const triggerRerender = () => {
    setRerender( Date.now() ) // force update / re-render of the DOM
  }

  // add my own written messages to history
  const addMsgToHistory = (historyEntry) => {
    // update chat history
    chatHistoryRef.current.push(historyEntry)
    msgRef.current.value = "" // clear input message field
  }

  // OWN messages sent
  const onSubmit = (e) => {
    e.preventDefault()

    // grab input message from the user by looking up the DOM value
    let msg = msgRef.current.value

    // construct a history entry
    let historyEntry = { text: msg, user: userName }

    addMsgToHistory(historyEntry) // and MY messages to history

    // emit event to server (socket io)
    let socket = socketRef.current

    // send message to server => server should then broadcast it!
    socket.emit("message", historyEntry)

    triggerRerender() // please update now the history in DOM too!
  }


  // create JSX list from chat history entries
  let chatHistory = chatHistoryRef.current // grab the LATEST copy of chat messages
  let jsxChatHistory = chatHistory.map((chatMsg, i) => (
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
        <form id="message-send" onSubmit={onSubmit} >
          <input 
            ref={msgRef} // msgRef.current.value => to access the value of the input
            autoComplete="off"
            name="message-new" 
            placeholder={`Type your message, ${userName}...`} />
          <button type="submit" >Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
