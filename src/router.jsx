import { createBrowserRouter } from "react-router-dom";

import CatalogForm from "./componentes/CatalogForm";
import Home from "./pages/Home";
import Catalogs from "./pages/Catalogs";
import EditArticlesPage from './pages/EditArticlesPage';
import CreateCatalog from "./componentes/CreateCatalog";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
         path: '/modificar',
        element: <Catalogs />
    },
    {
         path: '/createArticle',
        element: <CatalogForm />
    },
    {
         path: '/editar/:id',
        element: <EditArticlesPage />
    },
    {
        path: '/crearCatalogo',
        element: <CreateCatalog />
    }
])
