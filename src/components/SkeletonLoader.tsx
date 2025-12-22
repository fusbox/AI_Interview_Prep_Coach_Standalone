import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonLoaderProps {
    variant?: 'interview' | 'review';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'review' }) => {
    return (
        <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden font-sans">
            {/* Top Header Skeleton */}
            <div className="h-16 border-b border-slate-200 bg-white flex items-center px-8 justify-between">
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
                <div className="w-32 h-6 rounded-full bg-slate-200 animate-pulse"></div>
            </div>

            <div className="flex flex-col lg:flex-row h-full relative">
                {/* 
                  Layout Logic: 
                  Interview: 3 columns (45% | 35% | 20%)
                  Review: 2 columns (50% | 50%)
                */}

                {/* Column 1: Main Content */}
                <div className={cn(
                    "h-full flex flex-col p-8 border-r border-slate-200 bg-white",
                    variant === 'interview' ? "w-full lg:w-[45%]" : "w-full lg:w-1/2"
                )}>
                    {/* Breadcrumb / Label */}
                    <div className="w-24 h-4 rounded-md bg-slate-200 animate-pulse mb-8"></div>

                    {/* Main Card/Question Skeleton */}
                    <div className="w-full max-w-xl mx-auto space-y-6">
                        <div className="h-8 w-3/4 rounded-lg bg-slate-200 animate-pulse"></div>
                        <div className="h-8 w-1/2 rounded-lg bg-slate-200 animate-pulse"></div>

                        <div className="h-40 w-full rounded-2xl bg-slate-100 animate-pulse mt-8 border border-slate-200"></div>

                        {/* Action Buttons/Input */}
                        <div className="flex gap-4 mt-8">
                            <div className="h-12 flex-1 rounded-xl bg-slate-200 animate-pulse"></div>
                            <div className="h-12 flex-1 rounded-xl bg-slate-200 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Column 2: 
                   Interview: Tips (35%)
                   Review: Insights (50%)
                */}
                <div className={cn(
                    "hidden lg:flex h-full bg-slate-50/50 flex-col p-8 space-y-6",
                    variant === 'interview' ? "w-[35%] border-r border-slate-200" : "w-1/2"
                )}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-6 rounded bg-slate-200 animate-pulse"></div>
                        <div className="w-40 h-5 rounded bg-slate-200 animate-pulse"></div>
                    </div>

                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-full h-32 rounded-xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
                            <div className="w-1/3 h-4 rounded bg-slate-100 animate-pulse"></div>
                            <div className="w-full h-3 rounded bg-slate-50 animate-pulse"></div>
                            <div className="w-5/6 h-3 rounded bg-slate-50 animate-pulse"></div>
                            <div className="w-4/6 h-3 rounded bg-slate-50 animate-pulse"></div>
                        </div>
                    ))}
                </div>

                {/* Column 3: Interview Only (Sidebar Question List 20%) */}
                {variant === 'interview' && (
                    <div className="hidden lg:flex w-[20%] h-full flex-col bg-white border-l border-slate-100 p-4 space-y-4">
                        <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full mb-6"></div>

                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-3 items-center p-2">
                                <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                                <div className="h-3 w-full bg-slate-100 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Loading Text Overlay */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 font-medium text-sm animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#376497]"></div>
                Restoring your session...
            </div>
        </div>
    );
};

export default SkeletonLoader;
