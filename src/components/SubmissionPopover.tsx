import React, { useState } from 'react';
import { GlassCard } from './ui/glass/GlassCard';
import { GlassButton } from './ui/glass/GlassButton';
import { RefreshCcw, ArrowRight, Activity, Save, X, Copy, List } from 'lucide-react';
import { cn } from '../lib/utils';
import { ReviewQuestionItem } from './ui/glass/ReviewQuestionItem';
import { Question, AnalysisResult, CompetencyBlueprint } from '../types';

interface SubmissionPopoverProps {
    isOpen: boolean;
    onRetry: () => void;
    onFeedback: () => void;
    onNext: () => void;
    onClose?: () => void;
    isSessionComplete?: boolean;
    onFinish?: () => void;
    question?: Question;
    questionIndex?: number;
    answer?: {
        text?: string;
        audioBlob?: Blob;
        analysis: AnalysisResult | null;
    };
    blueprint?: CompetencyBlueprint;
    hasSkippedQuestions?: boolean;
    inline?: boolean;
}

export const SubmissionPopover: React.FC<SubmissionPopoverProps> = ({
    isOpen,
    onRetry,
    onFeedback,
    onNext,
    onClose,
    isSessionComplete = false,
    onFinish,
    question,
    questionIndex = 0,
    answer,
    blueprint,
    hasSkippedQuestions = false
}) => {
    const [showFeedback, setShowFeedback] = useState(false);

    if (!isOpen) return null;

    // Feedback Modal Overlay (Keep fixed overlay for the modal itself)
    if (showFeedback && question && answer) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:pl-64 bg-black/80 backdrop-blur-md animate-fade-in">
                <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto custom-scrollbar relative bg-transparent rounded-2xl">
                    {/* Header Controls: Copy & Close */}
                    <div className="sticky top-0 right-0 z-50 flex justify-end gap-2 px-6 py-6 md:px-8 md:py-8 pointer-events-none">
                        {/* Copy Button */}
                        <button
                            className="pointer-events-auto p-2 rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm shadow-lg"
                            title="Copy Answer"
                            aria-label="Copy Answer"
                        >
                            <Copy size={20} />
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowFeedback(false)}
                            className="pointer-events-auto p-2 rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm shadow-lg"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-1 md:px-4 pb-8 -mt-24 md:-mt-32">
                        <ReviewQuestionItem
                            q={{
                                ...question,
                                analysis: answer.analysis,
                                transcript: answer.text,
                                audioBlob: answer.audioBlob
                            }}
                            index={questionIndex}
                            isExpanded={true}
                            onToggle={() => { }}
                            hideExpandIcon={true}
                            className="pt-24 md:pt-32 min-h-[500px]"
                            blueprint={blueprint}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // If session complete, show special state (Text only, transparent inline) -> MOVED TO MODAL
    if (isSessionComplete) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                <GlassCard className="w-full max-w-md p-8 flex flex-col items-center gap-6 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white font-display tracking-wide">Session Complete!</h3>
                        <p className="text-gray-400 text-sm">Great job. Click Finish below to review your performance.</p>
                    </div>
                    <GlassButton
                        onClick={onFinish}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-white/10"
                    >
                        Finish & Review <ArrowRight size={16} className="ml-2" />
                    </GlassButton>
                </GlassCard>
            </div>
        );
    }

    // Standard View Answer Analysis (Text + Buttons, NOW MODAL)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in md:pl-64">
            <GlassCard className="w-full max-w-md p-8 flex flex-col items-center gap-6 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <Activity size={32} className="text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display tracking-wide">
                        Answer Recorded
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Would you like to analyze this answer now or move on?
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={onFeedback}
                        className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all font-bold text-sm uppercase tracking-wider border border-white/10"
                    >
                        View Analysis (Recommended)
                    </button>
                    <button
                        onClick={onNext}
                        className="w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all font-medium text-sm uppercase tracking-wider"
                    >
                        Back to Session
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};
