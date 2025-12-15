import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Home, ChevronDown, Bell, ChevronLeft, Sparkles, AlertCircle } from 'lucide-react';
import { sanitizeInput, truncateInput } from '../utils/sanitize';
import { useSession } from '../hooks/useSession';
import LoaderStaging from '../components/LoaderStaging';
import { useGuestTracker } from '../hooks/useGuestTracker';
import { useAuth } from '../context/AuthContext';

const MAX_JD_LENGTH = 3000;

const JobDescriptionInputStaging: React.FC = () => {
    const navigate = useNavigate();
    const { startSession } = useSession();
    const { hasCompletedSession } = useGuestTracker();
    const { user, signOut } = useAuth();
    const [jobDescription, setJobDescription] = useState('');
    const [role, setRole] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect hooked guests to signup
    React.useEffect(() => {
        if (!user && hasCompletedSession) {
            navigate('/auth?mode=signup');
        }
    }, [user, hasCompletedSession, navigate]);

    const handleSubmit = async () => {
        if (!role.trim() || jobDescription.length < 50) return;

        setIsProcessing(true);
        const sanitizedJD = sanitizeInput(truncateInput(jobDescription, MAX_JD_LENGTH));
        const sanitizedRole = sanitizeInput(truncateInput(role, 100));

        try {
            await startSession(sanitizedRole, sanitizedJD);
            navigate('/interview-staging');
        } catch (error) {
            alert("Failed to generate questions. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 font-sans text-gray-800">
            {/* RangamWorks Header */}
            <header className="flex-none bg-white border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo Placeholder */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/select-role-staging')}>
                            <span className="text-2xl font-bold text-blue-600 tracking-tight">Rangam<span className="text-green-500">Works</span></span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <a href="#" className="hover:text-blue-600 transition-colors h-16 flex items-center px-1">Dashboard</a>
                            <a href="#" className="text-blue-600 border-b-2 border-blue-600 h-16 flex items-center px-1">Interview Prep</a>
                            <div className="group relative h-16 flex items-center px-1 cursor-pointer">
                                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">Resources <ChevronDown className="w-4 h-4" /></span>
                            </div>
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
                            <Bell className="w-5 h-5" />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <span className="text-sm font-medium text-gray-600 hidden sm:block">{user.email}</span>
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center cursor-pointer" onClick={handleSignOut}>
                                    <span className="text-xs font-bold">{user.email?.[0].toUpperCase()}</span>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => navigate('/auth')} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-6">
                        <button onClick={() => navigate('/select-role-staging')} className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm font-medium mb-4">
                            <ChevronLeft size={16} /> Back to Roles
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Interview</h1>
                        <p className="text-gray-600 text-lg">
                            Paste a job description below to generate a tailored interview session.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10 relative overflow-hidden">
                        import LoaderStaging from '../components/LoaderStaging';
                        // ...
                        {isProcessing && (
                            <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                                <LoaderStaging />
                                <p className="mt-8 text-blue-600 font-medium text-lg animate-pulse">Analyzing job description...</p>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Job Title / Role</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Product Manager"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Job Description</label>
                                <textarea
                                    placeholder="Paste the full job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    maxLength={MAX_JD_LENGTH}
                                    className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-gray-800 placeholder:text-gray-400 leading-relaxed"
                                />
                                <div className="flex justify-between mt-2 text-xs font-medium">
                                    <span className={jobDescription.length < 50 ? "text-amber-500 flex items-center gap-1" : "text-gray-400"}>
                                        {jobDescription.length < 50 && <AlertCircle size={12} />} Min 50 characters
                                    </span>
                                    <span className={jobDescription.length >= MAX_JD_LENGTH ? "text-red-500" : "text-gray-400"}>
                                        {jobDescription.length} / {MAX_JD_LENGTH}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!role.trim() || jobDescription.length < 50 || isProcessing}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={20} className="text-blue-200" />
                                    Generate Custom Questions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobDescriptionInputStaging;
