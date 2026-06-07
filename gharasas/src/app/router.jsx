import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';

// Lazy loading views
const Home = lazy(() => import('../features/home'));
const ServicesPage = lazy(() => import('../features/services'));
const AfiliadosPage = lazy(() => import('../features/afiliados'));
const CatalogoPage = lazy(() => import('../features/catalogo'));
const FamiliaGharaPage = lazy(() => import('../features/familia'));
const CalculatorPage = lazy(() => import('../features/calculator'));
const ResidentialServices = lazy(() => import('../features/services/pages/ResidentialServices'));
const EnterpriseServices = lazy(() => import('../features/services/pages/EnterpriseServices'));
const DescargablesPage = lazy(() => import('../features/descargables'));
const PQRPage = lazy(() => import('../features/pqr'));
const FaqPage = lazy(() => import('../features/faq'));
const PoliticaDatosPage = lazy(() => import('../features/politica-datos'));

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
            {
                path: 'catalogo',
                element: <CatalogoPage />,
            },
            {
                path: 'familia',
                element: <FamiliaGharaPage />,
            },
            {
                path: 'calculadora',
                element: <CalculatorPage />,
            },
            {
                path: 'descargables',
                element: <DescargablesPage />,
            },
            {
                path: 'pqr',
                element: <PQRPage />,
            },
            {
                path: 'preguntas-frecuentes',
                element: <FaqPage />,
            },
            {
                path: 'politica-de-datos',
                element: <PoliticaDatosPage />,
            },
        ],
    },
]);
