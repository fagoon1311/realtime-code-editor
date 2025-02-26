import React, { use, useEffect, useRef, useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import ACTIONS from '../Actions'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { initSocket } from '../socket'
import toast from 'react-hot-toast'


const EditorPage = () => {

  const socketRef = useRef(null) // useRef to store the socket connection it avoids re-rendering of the component.
  const location = useLocation() // useLocation hook to get the location object from the react-router-dom.
  const reactNavigator = useNavigate();
  const { roomId } = useParams()
  const [clients, setClients] = useState([])
  const codeRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket()

      socketRef.current.on('connect_error', (err) => handleErrors(err))
      socketRef.current.on('connect_failed', (err) => handleErrors(err))
      
      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
    }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName
      })

      socketRef.current.on(ACTIONS.JOINED, ({clients, userName, socketId}) => {
        if (userName != location.state?.userName) {
          toast.success(`${userName} joined the room!`)
          console.log(`${userName} joined the room!`)
        }
        setClients(clients)
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        })

      })

      

      //listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, userName}) => {
        toast.success(`${userName} left the room!`)
        setClients(clients => clients.filter(client => client.socketId !== socketId))
      })
   }
    init()

    // clearing the listeners
    
  }, [])

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success('Room ID copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy room ID!')
      console.log('Failed to copy room ID!', error)
    }
  }
  
  function leaveRoom() {
    reactNavigator('/')

  }


  if(!location.state) return <Navigate to='/' />

   return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className='logoImage' src='/code-sync.png' alt=''></img>
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients.map(client=><Client key={client.socketId} userName={client.userName} />)
            }
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button> 
      </div>
      <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId = {roomId} onCodeChange={(code)=>{codeRef.current = code}}/>
      </div>
    </div>
  )
}

export default EditorPage