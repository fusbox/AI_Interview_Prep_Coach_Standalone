import { createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

import { Portal } from './pages/Portal';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { InterviewSetup } from './pages/InterviewSetup';
import { InterviewSession } from './pages/InterviewSession';
import { InterviewReview } from './pages/InterviewReview';
import { ResumeUploader } from './pages/ResumeUploader';
import { Training } from './pages/Training';
import { UserDataRights } from './features/UserDataRights';

export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/auth', element: <Auth /> },

    // NEW UI: Main App Routes (Glass UI)
    {
        element: (
            <ErrorBoundary>
                <ProtectedRoute />
            </ErrorBoundary>
        ),
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { path: '/portal', element: <Portal /> },
                    { path: '/dashboard', element: <DashboardHome /> },
                    { path: '/interview', element: <InterviewSetup /> },
                    { path: '/resume-builder', element: <ResumeUploader /> },
                    { path: '/training', element: <Training /> },
                    { path: '/glass/interview/session', element: <InterviewSession /> },
                    { path: '/interview/session', element: <InterviewSession /> },
                    { path: '/review', element: <InterviewReview /> },
                    { path: '/settings', element: <div className="p-8"><UserDataRights /></div> }
                ]
            }
        ]
    },

    // Public / Guest Routes
    { path: '/select-role', element: <RoleSelection /> },
]);
