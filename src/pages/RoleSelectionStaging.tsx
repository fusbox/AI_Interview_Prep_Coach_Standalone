import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    User,
    ChevronDown,
    Bell,
    Code,
    ShoppingBag,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import LoaderStaging from '../components/LoaderStaging';
import { TECH_ROLES, SERVICE_ROLES } from '../types';
import { ROLE_ICONS } from '../constants';
import { useSession } from '../hooks/useSession';
import { useAuth } from '../context/AuthContext';
import { useGuestTracker } from '../hooks/useGuestTracker';

const RoleSelectionStaging: React.FC = () => {
    const navigate = useNavigate();
    const { startSession } = useSession();
    const { user, signOut } = useAuth();
    const { hasCompletedSession } = useGuestTracker();
    const [processingState, setProcessingState] = useState<{ isActive: boolean; text: string }>({ isActive: false, text: '' });

    // Redirect hooked guests to signup
    React.useEffect(() => {
        if (!user && hasCompletedSession) {
            navigate('/auth?mode=signup');
        }
    }, [user, hasCompletedSession, navigate]);

    const selectRole = async (role: string) => {
        setProcessingState({ isActive: true, text: 'Preparing your interview...' });
        try {
            await startSession(role);
            navigate('/interview-staging');
        } catch (e) {
            alert("Failed to generate questions. Please try again.");
        } finally {
            setProcessingState({ isActive: false, text: '' });
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    const RoleSection = ({ title, roles, icon: Icon, colorClass, bgClass, hoverColorClass }: { title: string, roles: string[], icon: any, colorClass: string, bgClass: string, hoverColorClass: string }) => (
        <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() => selectRole(role)}
                        className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all text-left flex flex-col h-full relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
                        </div>

                        <div className="mb-4 w-12 h-12">
                            {ROLE_ICONS[role] ? (
                                <div
                                    className={`w-full h-full bg-slate-600 ${hoverColorClass} transition-colors duration-300`}
                                    style={{
                                        mask: `url('${ROLE_ICONS[role]}') center center / contain no-repeat`,
                                        WebkitMask: `url('${ROLE_ICONS[role]}') center center / contain no-repeat`,
                                    }}
                                />
                            ) : (
                                <div className={`w-full h-full rounded-full flex items-center justify-center ${bgClass} ${colorClass}`}>
                                    <Icon size={20} />
                                </div>
                            )}
                        </div>

                        <div className="relative z-10 flex-1">
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-lg">{role}</h4>
                            <p className="text-sm text-gray-500 mb-4">Practice standard interview questions for this role.</p>
                        </div>

                        <div className="relative z-10 mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                            <span>Start Session</span>
                            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 font-sans text-gray-800">
            {/* RangamWorks Header */}
            <header className="flex-none bg-white border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo Placeholder */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
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
                <div className="max-w-7xl mx-auto">
                    {processingState.isActive && (
                        <div className="fixed inset-0 z-50 bg-gray-50/80 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
                            <LoaderStaging />
                            <p className="mt-8 text-gray-800 font-medium text-xl animate-pulse">{processingState.text}</p>
                        </div>
                    )}

                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Role</h1>
                        <p className="text-gray-600 max-w-3xl text-lg">
                            Choose a role below to start a simulated interview session. Our AI will guide you through relevant questions and provide feedback on your answers.
                        </p>
                    </div>

                    {/* Custom Role Banner */}
                    <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Sparkles className="w-6 h-6 text-yellow-300" />
                                </div>
                                <h2 className="text-2xl font-bold">Have a specific job description?</h2>
                            </div>
                            <p className="text-blue-100 max-w-xl">
                                Paste a job description to generate a 100% tailored interview session specifically for that role.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/job-description-staging')}
                            className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg shadow-sm transition-all transform hover:scale-105 whitespace-nowrap"
                        >
                            Use Custom Job Description
                        </button>
                    </div>

                    {/* Role Sections */}
                    <RoleSection
                        title="Technology & Corporate"
                        roles={TECH_ROLES}
                        icon={Code}
                        colorClass="text-indigo-600"
                        bgClass="bg-indigo-100"
                        hoverColorClass="group-hover:bg-blue-600"
                    />

                    <RoleSection
                        title="Service & Operations"
                        roles={SERVICE_ROLES}
                        icon={ShoppingBag}
                        colorClass="text-emerald-600"
                        bgClass="bg-emerald-100"
                        hoverColorClass="group-hover:bg-green-500"
                    />
                </div>
            </main>
        </div>
    );
};

export default RoleSelectionStaging;
