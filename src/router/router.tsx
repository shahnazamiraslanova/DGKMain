import {createBrowserRouter} from 'react-router-dom';
import PublicComponent from 'core/layouts/public/public.component';
import HomeComponent from 'pages/home/home.component';

import {Routes} from './routes';
import NotFound from 'pages/not-found/notfound.component';
import AuthComponent from 'core/layouts/auth/auth.component';
import LoginComponent from 'pages/login/login.component';
import AuthProtectedComponent from './protected/auth-protected.component';
import AnnouncementComponent from 'pages/announcements/announcements.component';
import QuizesComponent from 'pages/quizes/quizes.component';
import SettingsComponent from 'pages/settings/settings.component';
import PollsComponent from 'pages/polls/polls.component';


const router = createBrowserRouter([
    {
        element: <AuthProtectedComponent layout='public'><PublicComponent/></AuthProtectedComponent>,
        children: [
            {
                path: Routes.home,
                element: <HomeComponent/>,
            },
            {
                path: Routes.announcement,
                element: <AnnouncementComponent/>,
            },
            {
                path: Routes.quiz,
                element: <QuizesComponent/>,
            },
            {
                path: Routes.poll,
                element: <PollsComponent/>,
            },
            {
                path: Routes.setting,
                element: <SettingsComponent/>,
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
