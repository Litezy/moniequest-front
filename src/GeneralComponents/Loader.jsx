import React from 'react'
import logo from '../assets/images/logoloader.png'

const Loader = ({ title }) => {
  return (
    <div className="w-full h-full absolute top-0 left-0 z-50 flex flex-col gap-1 items-center justify-center bg-dark/30 backdrop-blur-sm">
      <div className=' scrollHide'>
        <img src={logo} className='w-20 h-20 animate-bounce' alt="" />
      </div>
      {title && <div className='text-white'>...{title}</div>}
    </div>
  )
}

export default Loader