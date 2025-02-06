import React, { useEffect, useRef, useState } from 'react'
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
   }
    init()
  }, [])


  const [clients, setClients] = useState([{
    socketId: 1,
    userName: 'Fagoon'
  },{
    socketId: 2,
    userName: 'John'
  },{
    socketId: 3,
    userName: 'Doe'
  },{
    socketId: 4,
    userName: 'Jane'
  }
  ])

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
        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button> 
      </div>
      <div className='editorWrap'>
        <Editor />
      </div>
    </div>
  )
}

export default EditorPage