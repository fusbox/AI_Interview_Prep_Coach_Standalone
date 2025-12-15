import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Lock, Share2, Download, Home, RotateCcw, Bell, ChevronDown } from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { AnalysisResult } from '../types';
import { saveSession } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useGuestTracker } from '../hooks/useGuestTracker';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { cn } from '../lib/utils';

const SummaryStaging: React.FC = () => {
    const navigate = useNavigate();
    const { session, resetSession } = useSession();
    const { user, signOut } = useAuth();
    const { markSessionComplete } = useGuestTracker();
    const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
    const hasSaved = useRef(false);

    const calculateOverallScore = () => {
        const totalQs = session.questions.length;
        if (totalQs === 0) return 0;

        let scoreSum = 0;
        (Object.values(session.answers) as Array<{ audioBlob?: Blob; analysis: AnalysisResult | null }>).forEach(ans => {
            if (ans.analysis?.rating === 'Strong') scoreSum += 100;
            else if (ans.analysis?.rating === 'Good') scoreSum += 75;
            else scoreSum += 50;
        });

        return Math.round(scoreSum / totalQs);
    };

    const score = calculateOverallScore();

    // Side Effects: Save (if user) and Track (if guest)
    useEffect(() => {
        if (!hasSaved.current && session.questions.length > 0) {
            if (user) {
                // Member: Save permanently
                saveSession(session, score);
            } else {
                // Guest: Mark as "Hooked"
                markSessionComplete();
            }
            hasSaved.current = true;
        }
    }, [session, score, user, markSessionComplete]);

    const handleExit = () => {
        resetSession();
        navigate('/');
    };

    const handleSignup = () => {
        navigate('/auth?mode=signup');
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    const handleNewSession = () => {
        resetSession();
        navigate('/select-role-staging');
    };

    const getRatingColor = (rating?: string) => {
        switch (rating) {
            case 'Strong': return 'bg-green-100 text-green-700 border-green-200';
            case 'Good': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200'; // Needs Practice
        }
    };

    const answerEntries = Object.values(session.answers) as Array<{ audioBlob?: Blob; analysis: AnalysisResult | null }>;
    const strongCount = answerEntries.filter(a => a.analysis?.rating === 'Strong').length;
    const goodCount = answerEntries.filter(a => a.analysis?.rating === 'Good').length;
    const practiceCount = answerEntries.filter(a => a.analysis?.rating === 'Needs Practice').length;

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans text-gray-800">
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

            <div className="flex-1 overflow-y-auto">
                <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-12 pb-32">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Interview Analysis</h2>
                            <p className="text-lg text-gray-600 mt-2">Personalized insights for <span className="font-semibold text-blue-600">{session.role}</span></p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleExit} variant="outline" className="gap-2 border-gray-200 text-gray-600 hover:text-gray-900">
                                <Home size={16} /> Home
                            </Button>
                            {user ? (
                                <Button onClick={handleNewSession} className="bg-gray-900 text-white hover:bg-gray-800 gap-2 shadow-lg shadow-gray-200">
                                    <RotateCcw size={16} /> New Session
                                </Button>
                            ) : (
                                <Button onClick={handleSignup} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-200">
                                    Sign Up to Save <ChevronRight size={16} />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* GUEST BANNER */}
                    {!user && (
                        <div className="bg-linear-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 mb-12 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">Keep your momentum going.</h3>
                                    <p className="text-blue-200 text-lg max-w-xl leading-relaxed">Create a free account to unlock your personal dashboard, track your improvement over time, and access deeper AI coaching insights.</p>
                                </div>
                                <Button onClick={handleSignup} size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-xl border-none">
                                    Create Free Account
                                </Button>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                                <Lock size={300} />
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Score Card */}
                        <Card className="col-span-1 border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-green-500"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-gray-600 font-medium text-sm uppercase tracking-wider">Readiness Score</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-6">
                                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                                        <circle
                                            cx="50" cy="50" r="40"
                                            fill="transparent"
                                            stroke={score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : '#f59e0b'}
                                            strokeWidth="6"
                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-5xl font-bold text-gray-900">{score}</span>
                                        <span className="text-xs font-semibold text-gray-400 uppercase mt-1">/ 100</span>
                                    </div>
                                </div>
                                <p className="text-center text-gray-500 text-sm">
                                    {score >= 80 ? "Excellent! You're ready." : score >= 60 ? "Good, but refine your answers." : "Keep practicing to improve."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Breakdown Card */}
                        <Card className="col-span-1 md:col-span-2 border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200"></div>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-gray-800">Performance Breakdown</CardTitle>
                                <CardDescription>Analysis of answer quality across all questions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-700 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div> Strong Answers
                                        </span>
                                        <span className="text-gray-900">{strongCount}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(strongCount / session.questions.length) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-700 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Good Answers
                                        </span>
                                        <span className="text-gray-900">{goodCount}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(goodCount / session.questions.length) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-700 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-500"></div> Needs Practice
                                        </span>
                                        <span className="text-gray-900">{practiceCount}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(practiceCount / session.questions.length) * 100}%` }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Analysis List */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Question Review</h3>
                        <div className="space-y-4">
                            {session.questions.map((q, i) => {
                                const ans = session.answers[q.id];
                                const isExpanded = expandedQuestionId === q.id;

                                return (
                                    <Card key={q.id} className={cn("border-gray-200 transition-all duration-300", isExpanded ? "shadow-md ring-1 ring-blue-50 border-blue-200" : "hover:border-blue-200")}>
                                        <div
                                            onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                                            className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 cursor-pointer gap-4"
                                        >
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={cn("shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-0.5",
                                                    ans?.analysis?.rating === 'Strong' ? 'bg-green-100 text-green-700' :
                                                        ans?.analysis?.rating === 'Good' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-amber-100 text-amber-700'
                                                )}>
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 text-lg leading-snug">{q.text}</h4>
                                                    {!isExpanded && <p className="text-sm text-gray-400 mt-2 font-medium">Click to view full analysis</p>}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-6 pl-12 md:pl-0">
                                                <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase border tracking-wider", getRatingColor(ans?.analysis?.rating))}>
                                                    {ans?.analysis?.rating || "Skipped"}
                                                </span>
                                                <ChevronRight className={cn("text-gray-400 transition-transform duration-300", isExpanded && "rotate-90")} size={20} />
                                            </div>
                                        </div>

                                        {isExpanded && ans?.analysis && (
                                            <div className="px-6 pb-8 pt-2 border-t border-gray-50 animate-fade-in bg-gray-50/30">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                                    {/* Left: Transcript */}
                                                    <div>
                                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Response</h5>
                                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-gray-600 text-base leading-relaxed italic relative">
                                                            <span className="absolute top-4 left-4 text-4xl text-gray-100 font-serif leading-none">"</span>
                                                            <p className="relative z-10">{ans.analysis.transcript}</p>
                                                        </div>
                                                    </div>

                                                    {/* Right: Feedback */}
                                                    <div>
                                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Coach's Feedback</h5>
                                                        <ul className="space-y-4">
                                                            {ans.analysis.feedback.map((fb, idx) => (
                                                                <li key={idx} className="flex items-start gap-3 text-gray-700 bg-white p-4 rounded-xl border border-gray-100">
                                                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                                    <span className="leading-snug">{fb}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryStaging;
