import { Link } from 'react-router-dom';
import logo from '../../assets/logo_svg30_CYF.svg';
import { FcHome, FcEditImage, FcClapperboard, FcGallery } from "react-icons/fc";
import '../../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">

<header className='navbar-left'>
        <img src={logo} alt='Logo' className='logo-header' />
    </header>

      <ul>
        <li><Link to="/"><FcHome /> Inicio</Link></li>
        <li><Link to="/crearArticulo"><FcEditImage /> Añadir artículo</Link></li>
        <li><Link to="/modificar"><FcGallery /> Modificar</Link></li>
        <li><Link to="/crearCatalogo"><FcClapperboard /> Crear Catalogo</Link></li>

      </ul>
    </nav>
  );
};

export default Navbar;
