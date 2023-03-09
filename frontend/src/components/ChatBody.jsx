import React from 'react'
import { useNavigate } from "react-router-dom"

const ChatBody = ({ messages, typingStatus, lastMessageRef, socket }) => {
  const navigate = useNavigate()


  const handleLeaveChat = () => {
    localStorage.removeItem("username")
    socket.emit("userLeft", { socketId: socket.id })
    navigate("/")
    window.location.reload()
  }

  return (
    <>
      <header className='flex justify-between items-center w-full h-[10vh] p-[20px]'>
        <h1 className='font-bold text-gray-800 text-xl'>&lt;Group Chat</h1>
        <button className='leaveChat__btn' onClick={handleLeaveChat}>LEAVE CHAT</button>
      </header>


      <div className='message__container'>
        {messages.map(message => (
          message.name === localStorage.getItem("username") ? (
            <div className="message__chats" key={message.id}>
              <p className='sender__name'>You</p>
              <div className='message__sender'>
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className='message__recipient'>
                <p>{message.text}</p>
              </div>
            </div>
          )
        ))}

        <div className='message__status'>
          <p>{typingStatus.username !== localStorage.getItem("username") && typingStatus.message}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  )
}

export default ChatBody