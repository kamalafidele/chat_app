import React, { useState, useEffect } from 'react'

const ChatBar = ({ socket }) => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("username"))
  const [users, setUsers] = useState([])

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  useEffect(() => {
    socket.on("newUserResponse", data => {
      let filteredUsers = getUniqueListBy(data, 'username')
      setUsers(filteredUsers)
    })
  }, [])

  return (
    <div className='chat__sidebar text-white'>
      <h2>Open Chat</h2>
      <div>
        <h4 className='chat__header'>ONLINE USERS</h4>
        <div className='chat__users'>
          {users.map(user => (
            <p className='font-bold cursor-pointer hover:text-gray-400' key={user.socketId}>{user.username}{user.username === currentUser && "(You)"}</p>))}
        </div>
      </div>
    </div>
  )
}

export default ChatBar