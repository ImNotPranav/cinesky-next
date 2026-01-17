import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='bg-[#1a1a1a]'>
        <h1 className='text-white'>This page doesn't exist!</h1>
        <NavLink className='text-white' to="/">Go back Home?</NavLink>
    </div>
  )
}

export default NotFound