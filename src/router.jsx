import { createBrowserRouter } from "react-router-dom";

import CatalogForm from "./componentes/CatalogForm";
import Home from "./pages/Home";
import Catalogs from "./pages/Catalogs";
import EditArticlesPage from './pages/EditArticlesPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
         path: '/catalogs',
        element: <Catalogs />
    },
    {
         path: '/create',
        element: <CatalogForm />
    },
    {
         path: '/editar/:id',
        element: <EditArticlesPage />
    },
    {
        path: '/export',
        element: 'ExportCatalog'
    }
])
