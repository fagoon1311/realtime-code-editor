import React, { useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'


const EditorPage = () => {
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