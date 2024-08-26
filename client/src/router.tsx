

import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ConfirmUserPage } from './pages/ConfirmUserPage';
import { SignUpPage } from './pages/SignUpPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element:<LoginPage />
    },
    {
        path: '/home',
        element: <HomePage />
    },
    {
        path: '/signup',
        element: <SignUpPage />
    },
    {
        path: '/confirm',
        element: <ConfirmUserPage />
    }
]);

