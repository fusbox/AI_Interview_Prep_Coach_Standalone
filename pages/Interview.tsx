import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, MessageSquare, Send, Lightbulb, Check } from '../components/Icons';
import AudioVisualizer from '../components/AudioVisualizer';
import QuestionCard from '../components/QuestionCard';
import QuestionTips from '../components/QuestionTips';
import Loader from '../components/Loader';
import { useSession } from '../hooks/useSession';
import { useRecording } from '../hooks/useRecording';
import { useTextAnswer } from '../hooks/useTextAnswer';
import { analyzeAnswer } from '../services/geminiService';

const Interview: React.FC = () => {
    const navigate = useNavigate();
    const { session, saveAnswer, loadTipsForQuestion, goToQuestion } = useSession();
    const { isRecording, mediaStream, startRecording, stopRecording } = useRecording();
    const { text, error: textError, handleTextChange, submitTextAnswer, resetText, maxLength } = useTextAnswer();

    const [processingState, setProcessingState] = useState<{ isActive: boolean; text: string }>({ isActive: false, text: '' });
    const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');

    // Safe access to current question
    const currentQ = session.questions[session.currentQuestionIndex];

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

    if (!currentQ) return <Loader />;

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
            navigate('/review');
        } catch (e) {
            alert("Failed to analyze answer.");
        } finally {
            setProcessingState({ isActive: false, text: '' });
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50">
            {processingState.isActive ? (
                <div className="flex-1 flex flex-col items-center justify-center animate-fade-in p-6">
                    <Loader />
                    <p className="mt-8 text-xl text-slate-700 font-semibold">{processingState.text}</p>
                    <p className="text-sm text-slate-400 mt-2">This may take a few seconds...</p>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row h-full overflow-hidden relative">

                    {/* Left Column (40%): Question & Input */}
                    <div className="w-full lg:w-[40%] h-full flex flex-col relative overflow-y-auto border-r border-slate-200 bg-white">
                        {/* Header */}
                        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                                {session.role || "Interview"}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                                Question {session.currentQuestionIndex + 1} of {session.questions.length}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col items-center p-6 lg:p-8 max-w-2xl mx-auto w-full">
                            <div className="w-full mb-6">
                                <QuestionCard
                                    question={currentQ?.text || "Loading..."}
                                    role={session.role}
                                    currentIndex={session.currentQuestionIndex}
                                    total={session.questions.length}
                                    hideHeader={true} // We have our own header now
                                />
                            </div>

                            {/* Input Method Toggle */}
                            <div className="flex p-1 bg-slate-100 rounded-xl mb-6 w-full max-w-sm mx-auto">
                                <button
                                    onClick={() => setActiveTab('voice')}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'voice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Mic size={16} /> Voice
                                </button>
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <MessageSquare size={16} /> Text
                                </button>
                            </div>

                            {/* Voice Input Area */}
                            {activeTab === 'voice' && (
                                <div className="flex flex-col items-center w-full animate-fade-in flex-1 justify-center min-h-[300px]">
                                    <div className="w-full h-32 flex items-center justify-center mb-8">
                                        {isRecording ? (
                                            <AudioVisualizer stream={mediaStream} isRecording={isRecording} />
                                        ) : (
                                            <div className="text-slate-400 text-sm text-center italic bg-slate-50 px-6 py-3 rounded-full border border-slate-100">
                                                Click the microphone to begin your answer
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6 relative">
                                        {!isRecording ? (
                                            <button
                                                onClick={handleStartRecording}
                                                className="w-20 h-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-110 focus:outline-none ring-4 ring-indigo-100 active:scale-95"
                                            >
                                                <Mic size={32} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleStopRecording}
                                                className="w-20 h-20 bg-white border-4 border-rose-500 text-rose-500 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 focus:outline-none active:scale-95"
                                            >
                                                <Square size={32} fill="currentColor" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-6 text-slate-500 font-medium tracking-wide text-sm uppercase">
                                        {isRecording ? "Listening..." : "Tap to record"}
                                    </p>
                                </div>
                            )}

                            {/* Text Input Area */}
                            {activeTab === 'text' && (
                                <div className="w-full animate-fade-in flex-1 flex flex-col">
                                    <div className="bg-slate-50 rounded-2xl shadow-inner border border-slate-200 p-4 relative flex-1 min-h-[200px]">
                                        <textarea
                                            value={text}
                                            onChange={(e) => handleTextChange(e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="w-full h-full p-4 text-slate-700 resize-none outline-none text-lg leading-relaxed bg-transparent"
                                            maxLength={maxLength}
                                        />
                                        <div className="flex justify-between items-center mt-2 px-2 absolute bottom-2 left-2 right-2">
                                            <span className={`text-xs font-medium ${text.length > maxLength * 0.9 ? 'text-orange-500' : 'text-slate-400'}`}>
                                                {text.length} / {maxLength}
                                            </span>
                                            {textError && <span className="text-xs text-red-500 font-medium">{textError}</span>}
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={handleTextSubmit}
                                            disabled={text.trim().length < 10}
                                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-indigo-200 flex items-center gap-2"
                                        >
                                            Submit Answer <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column (40%): Tips */}
                    <div className="w-full lg:w-[40%] h-full bg-slate-50 overflow-y-auto border-r border-slate-200 shadow-inner flex flex-col">
                        {/* Header */}
                        <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                            <Lightbulb size={18} className="text-amber-500" />
                            <h3 className="font-bold text-slate-700">Interview Tips & Advice</h3>
                        </div>

                        <div className="p-6 lg:p-8">
                            {currentQ?.tips ? (
                                <QuestionTips tips={currentQ.tips} />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-pulse opacity-70">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    <p className="text-slate-400 text-sm mt-4">Generating custom tips...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (20%): Sidebar Question List */}
                    <div className="hidden lg:flex lg:w-[20%] h-full flex-col bg-white overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-4 flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                {session.questions.length}
                            </span>
                            <h3 className="font-bold text-slate-700">Interview Roadmap</h3>
                        </div>

                        <div className="flex-1 p-3 space-y-2">
                            {session.questions.map((q, index) => {
                                const isActive = index === session.currentQuestionIndex;
                                const isAnswered = !!session.answers[q.id];

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => goToQuestion(index)}
                                        className={`w-full text-left p-3 rounded-lg text-sm border transition-all relative group
                                            ${isActive
                                                ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-500'
                                            }
                                        `}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors
                                                ${isAnswered
                                                    ? 'bg-emerald-500 text-white'
                                                    : isActive
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-slate-100 text-slate-400'}
                                            `}>
                                                {isAnswered ? <Check size={12} strokeWidth={3} /> : index + 1}
                                            </div>
                                            <span className={`line-clamp-3 ${isActive ? 'text-indigo-900 font-medium' : ''}`}>
                                                {q.text}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="p-4 mt-auto border-t border-slate-100 text-center sticky bottom-0 bg-white">
                            <button onClick={() => navigate('/')} className="text-xs text-slate-400 hover:text-rose-500 transition-colors">
                                End Session
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Interview;
