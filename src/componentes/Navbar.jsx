import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
    <>

    <nav className="navbar-center">
        <ul>
        <li>
            <Link to="/createArticle">Añadir Articulo</Link>
           </li>
           <li>
            <Link to="/modificar">Modificar Articulo</Link>
           </li>

           <li>
            <Link to="/crearCatalogo">Crear Catalogo</Link>
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
