import React from 'react'
import logo from '../assets/logo_svg30_CYF.svg'

const Header = () => {
  return (

    <header className='navbar-left'>
        <img src={logo} alt='Logo' className='logo-header' />
        <span>
        <h1>CorteFigura</h1>
        </span>
        <div className="navbar-right">
        <span>Modo administrador</span>
      </div>

    </header>
  )
}

export default Header
