import React from 'react';
import { Check, ChevronLeft } from './Icons';
import { cn } from '../lib/utils';
import { Question } from '../types';

interface QuestionListProps {
    questions: Question[];
    currentIndex: number;
    answers: Record<string, any>;
    onSelect: (index: number) => void;
    onBack?: () => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, currentIndex, answers, onSelect, onBack }) => {
    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <div className="px-6 py-6 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0 flex items-center gap-3">
                {onBack && (
                    <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors -ml-2 p-1">
                        <ChevronLeft size={20} />
                    </button>
                )}
                <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider">Question Set</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {questions.map((q, index) => {
                    const isActive = index === currentIndex;
                    const isAnswered = !!answers[q.id];

                    return (
                        <button
                            key={q.id}
                            onClick={() => onSelect(index)}
                            className={cn(
                                "w-full text-left p-4 rounded-xl text-sm transition-all duration-200 relative group flex gap-3 items-start",
                                isActive
                                    ? "bg-blue-50/80 text-[#1e3a5f] shadow-sm ring-1 ring-blue-100"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            )}
                        >
                            <div className={cn(
                                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all",
                                isAnswered
                                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                                    : isActive
                                        ? "bg-[#376497] text-white shadow-sm shadow-blue-200"
                                        : "bg-slate-100 text-slate-400"
                            )}>
                                {isAnswered ? <Check size={12} strokeWidth={3} /> : index + 1}
                            </div>
                            <span className={cn(
                                "leading-relaxed wrap-break-word",
                                isActive ? "font-semibold" : "font-medium"
                            )}>

                                <span dangerouslySetInnerHTML={{ __html: q.text }} />
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionList;
