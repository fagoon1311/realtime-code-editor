import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate() // to navigate to different page
  const [roomId, setRoomId] = useState(''); // to store room id
  const [userName, setUserName] = useState(''); // to store user name

  const createNewRoom = (e) => {
    e.preventDefault() // to avoid refresh
    const id = uuid() // generate unique id
    setRoomId(id) // set room id
    toast.success('Room created successfully!') // show success message
  }

  const joinRoom = (e) => {
    if(!roomId || !userName){
      toast.error('Please fill all the fields!') // show error message
      return
    }
    // redirect to editor page with room id
    navigate(`/editor/${roomId}`, {state: {userName: userName}}) // state option is used to pass data to next page
  }

  // function to handle enter key press
  const handleInputEnter = (e) => {
    if(e.code === 'Enter'){
      joinRoom()
    }
  }

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img className="homePageLogo" src='/code-sync.png' alt = 'code-sync-logo'></img>
        <h4 className='maiLabel'>Paste Invitation Room ID</h4>
        <div className='inputGroup'>
          <input type='text' className="inputBox" placeholder='Room ID' value={roomId} onChange={(e)=>setRoomId(e.target.value)} onKeyUp={handleInputEnter}/>
          <input type='text' className="inputBox" placeholder='UserName' value={userName} onChange={(e)=>setUserName(e.target.value)} onKeyUp={handleInputEnter}/>
          <button onClick={joinRoom} className='btn joinBtn'>Join</button>
          <span className='createInfo'> If you don't have an invite create &nbsp;
            <a onClick={createNewRoom} href='' className='createNewBtn'>new room</a>
          </span>
        </div>
      </div>
      <footer className='footer'>Built with ❤️ by <a href="https://github.com/fagoon1311">Fagoon</a></footer>
    </div>
  )
}

export default Home