import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from '../features/home';
import ServicesPage from '../features/services';
import AfiliadosPage from '../features/afiliados';
import CatalogoPage from '../features/catalogo';
import FamiliaGharaPage from '../features/familia';
import CalculatorPage from '../features/calculator';
import ResidentialServices from '../features/services/pages/ResidentialServices';
import EnterpriseServices from '../features/services/pages/EnterpriseServices';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'servicios',
                element: <ServicesPage />,
            },
            {
                path: 'servicios/residenciales',
                element: <ResidentialServices />,
            },
            {
                path: 'servicios/empresariales',
                element: <EnterpriseServices />,
            },
            {
                path: 'aliados',
                element: <AfiliadosPage />,
            },
            /* {
                path: 'catalogo',
                element: <CatalogoPage />,
            }, */
            {
                path: 'familia',
                element: <FamiliaGharaPage />,
            },
            {
                path: 'calculadora',
                element: <CalculatorPage />,
            },
        ],
    },
]);
