import {createBrowserRouter} from 'react-router-dom';
import PublicComponent from 'core/layouts/public/public.component';
import HomeComponent from 'pages/home/home.component';
import FormComponent from 'pages/form/form.component';
import TableComponent from 'pages/table/table.component';
import {Routes} from './routes';
import NotFound from 'pages/not-found/notfound.component';
import AuthComponent from 'core/layouts/auth/auth.component';
import LoginComponent from 'pages/login/login.component';
import AuthProtectedComponent from './protected/auth-protected.component';


const router = createBrowserRouter([
    {
        element: <AuthProtectedComponent layout='public'><PublicComponent/></AuthProtectedComponent>,
        children: [
            {
                path: Routes.home,
                element: <HomeComponent/>,
            },
            {
                path: Routes.form,
                element: <FormComponent/>,
            },
            {
                path: Routes.table,
                element: <TableComponent/>,
            }
        ],
    },
    {
        path: Routes.auth,
        element: <AuthProtectedComponent layout='auth'><AuthComponent/></AuthProtectedComponent>,
        children: [
            {
                path: Routes.login,
                element: <LoginComponent/>,
            },
           
        ],
    },
    {
        path: '*',
        element: <NotFound/>,
    }
], {basename: '/',});

export default router;
