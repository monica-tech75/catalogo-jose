import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
    <>

    <nav className="navbar-center">
        <ul>
           <li>
            <Link to="/catalogs">Catalogos</Link>
           </li>
           <li>
            <Link to="/create">Crear Catalogo</Link>
           </li>
           <li>
            <Link to="/">Eliminar Catalogo</Link>
           </li>
           <li>
            <Link to="/">Modificar Catalogo</Link>
           </li>
        </ul>
    </nav>


    </>
  )
}

export default Navbar
