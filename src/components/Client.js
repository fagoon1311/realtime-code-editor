import React from 'react'
import { Avatar } from 'radix-ui'

const Client = ({userName}) => {
    console.log(userName)
  return (
    <div className='client'>
        <Avatar name={userName} size={50} round='14px'/>
        <span className='userName'>{userName}</span>
    </div>
  )
}

export default Client