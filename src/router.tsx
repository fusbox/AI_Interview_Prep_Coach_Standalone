import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import Interview from './pages/Interview';
import Review from './pages/Review';
import Summary from './pages/Summary';
import JobDescriptionInput from './pages/JobDescriptionInput';
import Dashboard from './pages/Dashboard';
import DebugPrompt from './pages/DebugPrompt';
import SessionDetail from './pages/SessionDetail';
import Ready2WorkLanding from './pages/Ready2WorkLanding';

import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelectionStaging from './pages/RoleSelectionStaging';
import InterviewStaging from './pages/InterviewStaging';
import JobDescriptionInputStaging from './pages/JobDescriptionInputStaging';
import ReviewStaging from './pages/ReviewStaging';
import SummaryStaging from './pages/SummaryStaging';

export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/auth', element: <Auth /> },

    // Public / Guest Routes (Teaser Access)
    { path: '/select-role', element: <RoleSelection /> },
    { path: '/select-role-staging', element: <RoleSelectionStaging /> },
    { path: '/job-description', element: <JobDescriptionInput /> },
    { path: '/job-description-staging', element: <JobDescriptionInputStaging /> },
    { path: '/interview', element: <Interview /> },
    { path: '/interview-staging', element: <InterviewStaging /> },
    { path: '/review-staging', element: <ReviewStaging /> },
    { path: '/summary-staging', element: <SummaryStaging /> },
    { path: '/review', element: <Review /> },
    { path: '/summary', element: <Summary /> },

    // Protected Member Routes
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/debug', element: <DebugPrompt /> },
            { path: '/session/:id', element: <SessionDetail /> },
            { path: '/ready2work', element: <Ready2WorkLanding /> },
        ]
    }
]);
