import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, GraduationCap, User, ChevronDown, Bell, Search, Menu } from 'lucide-react';

const Ready2WorkLanding: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* RangamWorks Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo Placeholder */}
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-600 tracking-tight">Rangam<span className="text-green-500">Works</span></span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <a href="#" className="text-blue-600 border-b-2 border-blue-600 h-16 flex items-center px-1">Dashboard</a>
                            <a href="#" className="hover:text-blue-600 transition-colors h-16 flex items-center px-1">My Jobs</a>
                            <div className="group relative h-16 flex items-center px-1 cursor-pointer">
                                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">About Us <ChevronDown className="w-4 h-4" /></span>
                            </div>
                            <div className="group relative h-16 flex items-center px-1 cursor-pointer">
                                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">Resources <ChevronDown className="w-4 h-4" /></span>
                            </div>
                            <a href="#" className="hover:text-blue-600 transition-colors h-16 flex items-center px-1">Contact Us</a>
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer pl-4 border-l border-gray-200">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Breadcrumb / Page Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Dashboard <span className="text-gray-400 text-lg font-normal">/ Ready2Work</span>
                    </h1>
                    <p className="text-gray-500 mt-1">Access tools to boost your career readiness.</p>
                </div>

                {/* Hero / Banner Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                    <div className="z-10 max-w-xl">
                        <img src="/ready2work.svg" alt="Ready2Work" className="h-16 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Unlock Your Potential</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Welcome to your comprehensive career preparation hub. Master your interview skills, craft the perfect resume, and access world-class training materials—all in one place.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-200">
                            Get Started Tour
                        </button>
                    </div>
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-blue-50 to-transparent"></div>
                    {/* Decorative circles/elements could go here */}
                </div>

                {/* Module Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Interview Prep Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group overflow-hidden flex flex-col h-full">
                        <div className="p-6 flex-1">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Interview Coach</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Practice with AI-driven roleplay simulations. Get real-time feedback on your answers, tone, and pacing.
                            </p>
                            <ul className="text-sm text-gray-600 space-y-2 mb-6">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Realistic Scenarios</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Instant Feedback Scores</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Tailored to your Role</li>
                            </ul>
                        </div>
                        <div className="p-6 pt-0 mt-auto">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2 group-hover:border-blue-500 group-hover:text-blue-600"
                            >
                                Launch Coach
                            </button>
                        </div>
                    </div>

                    {/* Resume Builder Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group overflow-hidden flex flex-col h-full relative">
                        <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            Coming Soon
                        </div>
                        <div className="p-6 flex-1">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Builder</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Create ATS-friendly resumes that stand out. Use our templates and AI suggestions to highlight your strengths.
                            </p>
                        </div>
                        <div className="p-6 pt-0 mt-auto">
                            <button disabled className="w-full bg-gray-100 text-gray-400 font-medium py-2 rounded-lg cursor-not-allowed">
                                Not Available Yet
                            </button>
                        </div>
                    </div>

                    {/* Training Content Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group overflow-hidden flex flex-col h-full relative">
                        <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            Coming Soon
                        </div>
                        <div className="p-6 flex-1">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Training Academy</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Upskill with courses designed for today's job market. Earn badges and certifications to display on your profile.
                            </p>
                        </div>
                        <div className="p-6 pt-0 mt-auto">
                            <button disabled className="w-full bg-gray-100 text-gray-400 font-medium py-2 rounded-lg cursor-not-allowed">
                                Not Available Yet
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm">
                        © {new Date().getFullYear()} Driven by Rangam's TalentArbor Technology
                    </div>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Accessibility Statement</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Ready2WorkLanding;
