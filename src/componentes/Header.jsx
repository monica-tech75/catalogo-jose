import React from 'react'
import logo from '../assets/icon-192.png'

const Header = () => {
  return (

    <header className='navbar-left'>
        <img src={logo} alt='Logo' className='logo' />
        <span>
        <h1>Catalago Jose</h1>
        </span>
        <div className="navbar-right">
        <span>Modo administrador</span>
      </div>

    </header>
  )
}

export default Header
