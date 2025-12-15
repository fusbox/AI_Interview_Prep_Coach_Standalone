import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, RefreshCw, Award, ChevronRight, MessageSquare, CheckCircle2, Activity, Bell, ChevronDown } from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { useAuth } from '../context/AuthContext';

const ReviewStaging: React.FC = () => {
    const navigate = useNavigate();
    const { session, nextQuestion } = useSession();
    const { user, signOut } = useAuth();

    const currentQ = session.questions[session.currentQuestionIndex];
    const answer = session.answers[currentQ.id];
    const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            navigate('/summary-staging');
        } else {
            nextQuestion();
            navigate('/interview-staging');
        }
    };

    const handleRedo = () => {
        navigate('/interview-staging');
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    const getRatingColor = (rating?: string) => {
        switch (rating) {
            case 'Strong': return 'bg-green-100 text-green-700 border-green-200';
            case 'Good': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200'; // Needs Practice
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-white overflow-hidden font-sans text-gray-800">
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

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel: Question & Transcript */}
                <div className="w-full md:w-1/2 h-full overflow-y-auto border-r border-gray-100 bg-white">
                    <div className="p-6 md:p-12 max-w-xl mx-auto pb-12 md:pb-24">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Question {session.currentQuestionIndex + 1}</h3>
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">{currentQ.text}</h2>

                        <div className="bg-gray-50 p-8 rounded-2xl mb-8 border border-gray-100 shadow-inner">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wide flex items-center gap-2">
                                <Mic size={14} /> Your Transcript
                            </h4>
                            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                                {answer?.analysis?.transcript}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-100">
                            <button onClick={handleRedo} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                                <RefreshCw size={18} /> Retry
                            </button>
                            <button onClick={handleNextQuestion} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 ml-auto transition-all hover:translate-x-1">
                                {isLastQuestion ? (
                                    <>Finish & Analyze <Award size={18} /></>
                                ) : (
                                    <>Next Question <ChevronRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Insights */}
                <div className="w-full md:w-1/2 h-full overflow-y-auto bg-gray-50/80">
                    <div className="p-6 md:p-12 max-w-xl mx-auto pb-24">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">AI Insights</h3>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${getRatingColor(answer?.analysis?.rating)}`}>
                                {answer?.analysis?.rating} {answer?.analysis?.rating === 'Needs Practice' ? '' : 'Match'}
                            </span>
                        </div>

                        <div className="space-y-6">
                            {/* Key Terms Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Award size={20} />
                                    </div>
                                    <h4 className="font-semibold text-gray-800">Key Professional Terms</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {answer?.analysis?.keyTerms.map((term, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium border border-gray-200">
                                            {term}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Feedback Card - Only show if available */}
                            {(answer?.analysis?.deliveryStatus || answer?.analysis?.deliveryTips) && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                            <Activity size={20} />
                                        </div>
                                        <h4 className="font-semibold text-gray-800">Speaking Delivery</h4>
                                        {answer?.analysis?.deliveryStatus && (
                                            <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                                {answer.analysis.deliveryStatus}
                                            </span>
                                        )}
                                    </div>
                                    {answer?.analysis?.deliveryTips && (
                                        <ul className="space-y-3">
                                            {answer.analysis.deliveryTips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                                    <p className="text-gray-600 text-sm leading-relaxed">{tip}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* Feedback Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                        <MessageSquare size={20} />
                                    </div>
                                    <h4 className="font-semibold text-gray-800">Feedback</h4>
                                </div>
                                <ul className="space-y-4">
                                    {answer?.analysis?.feedback.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <p className="text-gray-600 leading-relaxed">{point}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewStaging;
