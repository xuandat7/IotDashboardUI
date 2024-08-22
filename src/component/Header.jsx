import React from 'react'
import './Header.css'
import Logo from './Logo'
import Profile from './Profile'
import Sidebar from './Sidebar'

function Header() {
  return (
    <header id='header' className='header fixed-top d-flex align-items-center'>
        <Logo />
        <Profile />
        
    </header>
  )
}

export default Header