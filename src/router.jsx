import { createBrowserRouter } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import CatalogForm from "./componentes/CatalogForm";
import Catalogs from "./pages/Catalogs";
import EditArticlesPage from './pages/EditArticlesPage';
import CreateCatalog from "./componentes/CreateCatalog";
import ExportCatalog from "./componentes/ExportCatalog";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/modificar',
               element: <Catalogs />
           },
           {
                path: '/crearArticulo',
               element: <CatalogForm />
           },
           {
                path: '/editar/:id',
               element: <EditArticlesPage />
           },
           {
               path: '/crearCatalogo',
               element: <CreateCatalog />
           },
           {
               path: '/exportar',
               element: <ExportCatalog />
           }
        ]
    },
])
