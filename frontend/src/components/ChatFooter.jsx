import React, { useState } from 'react'

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("")
  const handleTyping = () => socket.emit("typing", { username: localStorage.getItem("username"), message: `${localStorage.getItem("username")} is typing` })

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && localStorage.getItem("username")) {
      socket.emit("message",
        {
          text: message,
          name: localStorage.getItem("username"),
          id: `${socket.id}${Math.random()}`,
          socketId: socket.id
        }
      )
    }
    handleNotTyping();
    setMessage("")
  }
  const handleNotTyping = () => {
    setTimeout(() => {
      socket.emit("typing", { username: "", message: "" })
    }, 2000);
  }
  return (
    <div className='chat__footer'>
      <form className='form' onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder='Write message'
          className='message'
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          onKeyUp={handleNotTyping}
          onBlur={handleNotTyping}
        />
        <button className="sendBtn hover:translate-x-[0.1rem] duration-100">SEND</button>
      </form>
    </div>
  )
}

export default ChatFooter