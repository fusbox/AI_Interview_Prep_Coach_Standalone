import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, MessageSquare, Send, Lightbulb, Check, ChevronLeft, StopCircle, Bell, ChevronDown } from 'lucide-react';
import AudioVisualizer from '../components/AudioVisualizer';
import QuestionCard from '../components/QuestionCard';
import QuestionTips from '../components/QuestionTips';
import LoaderStaging from '../components/LoaderStaging';
import { useSession } from '../hooks/useSession';
import { useRecording } from '../hooks/useRecording';
import { useTextAnswer } from '../hooks/useTextAnswer';
import { analyzeAnswer } from '../services/geminiService';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { useGuestTracker } from '../hooks/useGuestTracker';
import { useAuth } from '../context/AuthContext';

const InterviewStaging: React.FC = () => {
    const navigate = useNavigate();
    const { session, saveAnswer, loadTipsForQuestion, goToQuestion } = useSession();
    const { isRecording, mediaStream, startRecording, stopRecording } = useRecording();
    const { text, error: textError, handleTextChange, submitTextAnswer, resetText, maxLength } = useTextAnswer();
    const { hasCompletedSession } = useGuestTracker();
    const { user, signOut } = useAuth();

    const [processingState, setProcessingState] = useState<{ isActive: boolean; text: string }>({ isActive: false, text: '' });
    const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');

    // Safe access to current question
    const currentQ = session.questions[session.currentQuestionIndex];

    // Redirect hooked guests
    React.useEffect(() => {
        if (!user && hasCompletedSession) {
            navigate('/auth?mode=signup');
        }
    }, [user, hasCompletedSession, navigate]);

    // Redirect if no questions (e.g. page reload on empty session)
    React.useEffect(() => {
        if (session.questions.length === 0) {
            navigate('/select-role');
        }
    }, [session.questions, navigate]);

    // Lazy load tips when current question changes
    React.useEffect(() => {
        if (currentQ && !currentQ.tips) {
            loadTipsForQuestion(currentQ.id);
        }
    }, [currentQ?.id, currentQ?.tips, loadTipsForQuestion]);

    if (!currentQ) return <LoaderStaging />;

    const handleStartRecording = async () => {
        try {
            await startRecording();
        } catch (err) {
            alert("Microphone access is required to use this app.");
        }
    };

    const handleStopRecording = async () => {
        const blob = await stopRecording();
        await processAnswer(blob);
    };

    const handleTextSubmit = async () => {
        const validText = submitTextAnswer();
        if (validText) {
            await processAnswer(validText);
        }
    };

    const processAnswer = async (input: Blob | string) => {
        setProcessingState({ isActive: true, text: 'Analyzing your answer...' });

        try {
            const result = await analyzeAnswer(currentQ.text, input);

            saveAnswer(currentQ.id, {
                audioBlob: typeof input !== 'string' ? input : undefined,
                text: typeof input === 'string' ? input : undefined,
                analysis: result
            });

            resetText();
            navigate('/review-staging');
        } catch (e) {
            alert("Failed to analyze answer.");
        } finally {
            setProcessingState({ isActive: false, text: '' });
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
            <div className="flex-1 flex overflow-hidden relative">
                {processingState.isActive && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
                        <LoaderStaging />
                        <p className="mt-6 text-blue-600 font-medium animate-pulse">{processingState.isActive ? "Analyzing your answer..." : "Preparing next question..."}</p>
                    </div>
                )}

                {/* Left Column (40%): Question & Input */}
                <div className="w-full lg:w-[45%] h-full flex flex-col relative border-r border-gray-200 bg-white shadow-sm z-10">
                    <div className="flex-none px-8 py-6 flex items-center justify-between bg-white z-20 border-b border-gray-100">
                        <button onClick={() => navigate('/select-role-staging')} className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm font-medium">
                            <ChevronLeft size={16} /> Back to Roles
                        </button>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                            {session.role || "Interview Session"}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col items-center">
                        <div className="w-full max-w-xl mx-auto space-y-8 mt-6">
                            <QuestionCard
                                question={currentQ?.text || "Loading..."}
                                role={session.role}
                                currentIndex={session.currentQuestionIndex}
                                total={session.questions.length}
                                hideHeader={true}
                            />

                            {/* Input Method Toggle */}
                            <div className="flex p-1.5 bg-gray-100 rounded-xl w-full max-w-xs mx-auto shadow-inner">
                                <button
                                    onClick={() => setActiveTab('voice')}
                                    className={cn(
                                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2",
                                        activeTab === 'voice'
                                            ? "bg-white text-blue-600 shadow-sm shadow-gray-200"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                    )}
                                >
                                    <Mic size={16} /> Voice
                                </button>
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={cn(
                                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2",
                                        activeTab === 'text'
                                            ? "bg-white text-blue-600 shadow-sm shadow-gray-200"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                    )}
                                >
                                    <MessageSquare size={16} /> Text
                                </button>
                            </div>

                            {/* Voice Input Area */}
                            {activeTab === 'voice' && (
                                <div className="flex flex-col items-center w-full animate-fade-in py-4">
                                    <div className="w-full h-40 flex items-center justify-center mb-4 relative">
                                        {isRecording ? (
                                            <div className="w-full relative">
                                                <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full animate-pulse"></div>
                                                <AudioVisualizer stream={mediaStream} isRecording={isRecording} />
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 text-sm font-medium text-center bg-gray-50 px-8 py-4 rounded-2xl border border-dashed border-gray-200 w-full max-w-xs">
                                                Click the microphone below to start recording your answer.
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center relative">
                                        {!isRecording ? (
                                            <button
                                                onClick={handleStartRecording}
                                                className="group relative w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                                            >
                                                <div className="absolute inset-0 rounded-full border-4 border-white/20 group-hover:border-white/40 transition-colors"></div>
                                                <Mic size={36} className="drop-shadow-sm" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleStopRecording}
                                                className="group w-24 h-24 bg-white border-4 border-red-100 text-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-100 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <StopCircle size={48} fill="currentColor" className="opacity-90 relative z-10" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-4 text-gray-400 font-semibold tracking-wider text-xs uppercase">
                                        {isRecording ? <span className="text-red-500 animate-pulse">● Recording in progress</span> : "Ready to Record"}
                                    </p>
                                </div>
                            )}

                            {/* Text Input Area */}
                            {activeTab === 'text' && (
                                <div className="w-full animate-fade-in flex flex-col h-[300px]">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1 relative flex-1 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300">
                                        <textarea
                                            value={text}
                                            onChange={(e) => handleTextChange(e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="w-full h-full p-6 text-gray-700 resize-none outline-none text-lg leading-relaxed bg-transparent rounded-xl"
                                            maxLength={maxLength}
                                        />
                                        <div className="absolute bottom-4 right-4 flex items-center gap-3">
                                            <span className={cn("text-xs font-semibold px-2 py-1 rounded bg-gray-100",
                                                text.length > maxLength * 0.9 ? 'text-amber-600 bg-amber-50' : 'text-gray-400'
                                            )}>
                                                {text.length} / {maxLength}
                                            </span>
                                        </div>
                                    </div>
                                    {textError && <p className="text-xs text-red-500 font-medium mt-2 px-2">{textError}</p>}

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={handleTextSubmit}
                                            disabled={text.trim().length < 10}
                                            className="px-8 h-12 text-base shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-700"
                                        >
                                            Submit <Send size={16} className="ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle Column (35%): Tips */}
                <div className="hidden lg:flex lg:w-[35%] h-full bg-gray-50/50 flex-col border-r border-gray-200">
                    <div className="px-8 py-6 border-b border-gray-200/50 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Lightbulb size={20} className="fill-current opacity-20" />
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Coach's Corner</h3>
                        </div>
                        <p className="text-sm text-gray-500">Key strategies for this specific question</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        {currentQ?.tips ? (
                            <QuestionTips tips={currentQ.tips} />
                        ) : (
                            <div className="space-y-6 opacity-30 animate-pulse">
                                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                                <div className="h-20 bg-gray-200 rounded-2xl"></div>
                                <div className="h-40 bg-gray-200 rounded-2xl"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (20%): Sidebar Question List */}
                <div className="hidden lg:flex lg:w-[20%] h-full flex-col bg-white overflow-y-auto border-l border-gray-200">
                    <div className="px-6 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4">Interview Progress</h3>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                                style={{ width: `${((session.currentQuestionIndex) / session.questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex-1 p-4 space-y-1">
                        {session.questions.map((q, index) => {
                            const isActive = index === session.currentQuestionIndex;
                            const isAnswered = !!session.answers[q.id];

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => goToQuestion(index)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl text-sm transition-all duration-200 relative group flex gap-3 items-start",
                                        isActive
                                            ? "bg-blue-50/80 text-blue-900 shadow-sm ring-1 ring-blue-100"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    )}
                                >
                                    <div className={cn(
                                        "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all",
                                        isAnswered
                                            ? "bg-green-500 text-white shadow-sm shadow-green-200"
                                            : isActive
                                                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                                : "bg-gray-100 text-gray-400"
                                    )}>
                                        {isAnswered ? <Check size={12} strokeWidth={3} /> : index + 1}
                                    </div>
                                    <span className={cn(
                                        "line-clamp-2 leading-relaxed",
                                        isActive ? "font-semibold" : "font-medium"
                                    )}>
                                        {q.text}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="p-6 mt-auto border-t border-gray-50 bg-gray-50/30">
                        <button onClick={() => navigate('/summary-staging')} className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider text-center">
                            End Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewStaging;
