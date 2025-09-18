import { Link } from 'react-router-dom';


const PrivateNavbar = () => {
  return (
    <>
    <nav className="navbar-center">
      <h1>Creador de catalogos</h1>
        <ul>
        <li>
            <Link to="/crearArticulo">Añadir Articulo</Link>
           </li>

           <li>
            <Link to="/crearCatalogo">Crear Catalogo</Link>
           </li>
           <li>
            <Link to="/modificar">Modificar Catalogo</Link>
           </li>
        </ul>
    </nav>


    </>
  )
}

export default PrivateNavbar
