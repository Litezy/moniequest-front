import React, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'


const PageLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className='mt-16'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default PageLayout