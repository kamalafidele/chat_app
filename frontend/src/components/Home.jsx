import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"

const Home = ({ socket }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("username", username)
    socket.emit("newUser", { username, socketId: socket.id })
    navigate("/chat")
  }
  return (
    <form className='home__container' onSubmit={handleSubmit}>
      <h1 className='font-bold text-gray-800 text-xl'>Welcome to &lt;Group Chat</h1>
      <label htmlFor="username">Enter username</label>
      <input type="text"
        minLength={3}
        name="username"
        id='username'
        className='max-w-md h-[40px] px-2 border-2 border-gray-200 rounded-md outline-none'
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button className='home__cta'>SIGN IN</button>
    </form>
  )
}

export default Home