import { createBrowserRouter } from "react-router-dom";

import CatalogForm from "./componentes/CatalogForm";
import Home from "./pages/Home";
import Catalogs from "./pages/Catalogs";

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
         path: '/delete',
        element: 'DeleteCatalog'
    },
    {
        path: '/export',
        element: 'ExportCatalog'
    }
])
