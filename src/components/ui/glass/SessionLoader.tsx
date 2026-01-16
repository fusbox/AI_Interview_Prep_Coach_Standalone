import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface SessionLoaderProps {
    isLoading: boolean;
    onTransitionComplete: () => void;
}

export const SessionLoader: React.FC<SessionLoaderProps> = ({ isLoading, onTransitionComplete }) => {
    const [stage, setStage] = useState<'loading' | 'transition' | 'complete'>('loading');

    // Effect 1: Handle Initial Loading & Data Readiness
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!isLoading && stage === 'loading') {
            // Enforce a minimum "Setting Up" time of 1.5s so the dot animation is seen
            timeout = setTimeout(() => {
                setStage('transition');
            }, 1500);
        }

        return () => clearTimeout(timeout);
    }, [isLoading, stage]);

    // Effect 2: Handle Transition Sequence
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (stage === 'transition') {
            // Show "Entering Interview Room..." for 1.25s, then finish
            timeout = setTimeout(() => {
                setStage('complete');
            }, 1250);
        }

        return () => clearTimeout(timeout);
    }, [stage]);

    // Effect 3: Handle Completion & Unmount
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (stage === 'complete') {
            // Wait for the exit animation (0.8s) to mostly finish
            timeout = setTimeout(() => {
                onTransitionComplete();
            }, 800);
        }
        return () => clearTimeout(timeout);
    }, [stage, onTransitionComplete]);

    return (
        <AnimatePresence>
            {stage !== 'complete' && (
                <motion.div
                    key="loader-overlay"
                    className={cn(
                        "fixed inset-0 z-100 flex flex-col items-center justify-center backdrop-blur-md transition-colors duration-1000 overflow-hidden",
                        stage === 'loading' ? "bg-black/95" : "bg-black/80"
                    )}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    <div className="relative flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            {stage === 'loading' ? (
                                <motion.div
                                    key="setup"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10, transition: { duration: 0.5 } }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    {/* Pulsing Dot Loader */}
                                    <div className="relative flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-cyan-500 animate-ping absolute opacity-75"></div>
                                        <div className="w-3 h-3 rounded-full bg-cyan-400 relative shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>
                                    </div>

                                    <h2 className="text-xl md:text-2xl font-light tracking-widest text-white uppercase font-display select-none">
                                        Setting Up Your Interview
                                    </h2>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="entering"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5 } }}
                                    className="flex flex-col items-center"
                                >
                                    {/* Identical style to Stage 1 */}
                                    <h2 className="text-xl md:text-2xl font-light tracking-widest text-white uppercase font-display select-none">
                                        Entering Interview Room...
                                    </h2>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
