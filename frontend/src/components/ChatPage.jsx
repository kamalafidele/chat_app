import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBar from './ChatBar'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'

const ChatPage = ({ socket }) => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("username") == null) {
      navigate("/")
    }
  }, [])
  useEffect(() => {
    socket.on("messageResponse", data => setMessages([...messages, data]))
  }, [socket, messages])

  useEffect(() => {
    socket.on("typingResponse", data => setTypingStatus(data))
  }, [socket])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen flex items-center w-8/12 m-auto">
      <ChatBar socket={socket} />
      <div className='chat__main'>
        <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef} socket={socket} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  )
}

export default ChatPage