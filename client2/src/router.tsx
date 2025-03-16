import { createBrowserRouter } from 'react-router-dom';
import { AllStoriesPage } from './pages/AllStoriesPage';
import { ConfirmUserPage } from './pages/ConfirmUserPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />
    },
    {
        path: '/home',
        element: <HomePage />
    },
    {
        path: '/home/:documentIdToGoTo',
        element: <HomePage />
    },
    {
        path: '/stories',
        element: <AllStoriesPage />
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
