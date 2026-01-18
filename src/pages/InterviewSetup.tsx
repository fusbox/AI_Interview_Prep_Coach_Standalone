import React, { useState } from 'react';
import { GlassCard } from '../components/ui/glass/GlassCard';
import { GlassButton } from '../components/ui/glass/GlassButton';
import { GlassTextarea } from '../components/ui/glass/GlassTextarea';
import { Upload, FileText, Mic, AlertCircle, Briefcase } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionContext } from '../hooks/useSessionContext';
import { ResumeUploadZone } from '../components/ResumeUploadZone';
import { IntakeForm } from '../components/IntakeForm';
import { OnboardingIntakeV1, DEFAULT_ONBOARDING_INTAKE_V1 } from '../types/intake';
import { SERVICE_ROLES, TECH_ROLES } from '../types';

export const InterviewSetup: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { startSession, resetSession, isLoading } = useSessionContext();
    const [jobDescription, setJobDescription] = useState('');
    // Initialize role from navigation state if available
    const [role, setRole] = useState(location.state?.role || '');
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showIntake, setShowIntake] = useState(false);

    const validateAndContinue = () => {
        if (!jobDescription.trim() || !role.trim()) {
            console.warn("Missing fields");
            setError("Please provide both a Role and Job Description.");
            return;
        }
        setError(null);
        setShowIntake(true);
    };

    const handleStartSession = (intakeData: OnboardingIntakeV1 = DEFAULT_ONBOARDING_INTAKE_V1) => {
        console.log("handleStartSession triggered with intake:", intakeData);

        if (!jobDescription.trim() || !role.trim()) {
            console.warn("Missing fields");
            setError("Please provide both a Role and Job Description.");
            return;
        }

        setIsStarting(true);
        setError(null);

        // Explicitly clear old session data to prevent stale content flash
        resetSession();
        console.log("Session reset, calling startSession...");

        // Start session in background (non-blocking) to allow immediate UI transition
        startSession(role, jobDescription, intakeData)
            .then(() => console.log("startSession completed successfully"))
            .catch(err => {
                console.error("Background session start failed:", err);
                // In a real app, we might want to navigate back or show a global toast error
            });

        // Navigate immediately to show the "Setting Up" loader in InterviewSession
        console.log("Navigating to /interview/session");
        navigate('/interview/session', { state: { isStarting: true } });
    };

    if (showIntake) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <button
                    onClick={() => setShowIntake(false)}
                    className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-1"
                >
                    &larr; Back to Role Setup
                </button>
                <IntakeForm
                    onSubmit={handleStartSession}
                    onSkip={() => handleStartSession(DEFAULT_ONBOARDING_INTAKE_V1)}
                />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-32 flex flex-col gap-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Interview Setup</h1>
                <p className="text-gray-400">Configure your session by providing a job description or selecting a standard role.</p>
            </div>

            {/* Top Section: Equal Width Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 z-10 relative">

                {/* Left: Custom JD Input */}
                <div className="flex flex-col gap-4 h-full">
                    <div className="px-1">
                        <h2 className="text-xl font-display font-semibold text-cyan-400">Paste a Job Description</h2>
                        <p className="text-sm text-gray-400">Simulate a real interview by pasting a specific job posting here.</p>
                    </div>

                    <GlassCard className="flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Briefcase className="text-cyan-400" size={20} />
                            Target Role
                        </h3>
                        <input
                            type="text"
                            placeholder="e.g. Senior Product Manager"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 mb-6 transition-colors"
                        />

                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FileText className="text-cyan-400" size={20} />
                            Job Description
                        </h3>
                        <div className="relative flex-1">
                            <GlassTextarea
                                placeholder="Paste the job description here (e.g., Senior Frontend Engineer at Google...)"
                                className="mb-1 font-mono text-sm flex-1 min-h-[200px]"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                error={error || undefined}
                                maxLength={3000}
                            />
                            <div className="text-right text-xs text-gray-500 mt-2">
                                {jobDescription.length}/3000
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Right: Role Selection */}
                <div className="flex flex-col gap-4 h-full">
                    <div className="px-1 shrink-0">
                        <h2 className="text-xl font-display font-semibold text-cyan-400">Choose a Standard Role</h2>
                        <p className="text-sm text-gray-400">Quickly start practicing with one of our pre-configured industry roles.</p>
                    </div>

                    <GlassCard className="flex-1 border-t-4 border-t-cyan-500 flex flex-col">
                        <h3 className="text-lg font-bold mb-4">Select a Role</h3>

                        <div className="space-y-6 flex-1">
                            <p className="text-sm text-gray-400">Selecting a role below will automatically fill the detailed fields for you.</p>

                            <div className="relative">
                                {/* Styled Select to match Intake Form aesthetic */}
                                <select
                                    value={role}
                                    onChange={(e) => {
                                        const newRole = e.target.value;
                                        setRole(newRole);
                                        if (newRole) {
                                            setJobDescription(`Standardized job description for ${newRole}`);
                                        }
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white appearance-none focus:outline-none focus:border-cyan-500/50 cursor-pointer text-base md:text-lg shadow-inner hover:bg-white/5 transition-colors"
                                    style={{
                                        backgroundImage: 'none' // Remove default arrow on some browsers
                                    }}
                                >
                                    <option value="" disabled className="bg-zinc-900 text-gray-500">Select a role...</option>
                                    <optgroup label="Service & Operations" className="bg-zinc-900 text-cyan-400 font-bold">
                                        {SERVICE_ROLES.map(r => (
                                            <option key={r} value={r} className="text-white font-normal bg-zinc-800">{r}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Corporate & Technical" className="bg-zinc-900 text-purple-400 font-bold">
                                        {TECH_ROLES.map(r => (
                                            <option key={r} value={r} className="text-white font-normal bg-zinc-800">{r}</option>
                                        ))}
                                    </optgroup>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Middle Section: Resume Upload (Full Width) */}
            <div className="z-0">
                <GlassCard>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Upload className="text-purple-400" size={20} />
                        Upload Resume (Optional)
                    </h3>
                    <ResumeUploadZone />
                </GlassCard>
            </div>

            {/* Bottom Section: Action Button (Full Width) */}
            <div className="w-full">
                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-sm text-red-300 animate-fade-in">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        {error}
                    </div>
                )}

                <GlassButton
                    className="w-full py-5 text-sm md:text-base font-bold shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-pulse hover:animate-none uppercase tracking-wide"
                    onClick={validateAndContinue}
                    disabled={isStarting}
                >
                    <Mic className="mr-2 w-5 h-5" />
                    {isStarting ? 'Generating Session...' : 'Customize Session'}
                </GlassButton>

                <p className="text-xs text-center text-gray-500 mt-4">
                    By starting, you agree to the recording of this session for analysis purposes.
                </p>
            </div>

            {/* Mobile Fixed Bottom Bar (Visible only on small screens < lg) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900/90 backdrop-blur-xl border-t border-white/10 lg:hidden z-50">
                <div className="flex items-center justify-between gap-4">
                    <div className="text-sm">
                        <div className="text-gray-400 text-xs">Target Role</div>
                        <div className="font-bold truncate max-w-[150px]">{role || 'Not set'}</div>
                    </div>
                    <GlassButton
                        className="flex-1 py-3 text-base shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        onClick={validateAndContinue}
                        disabled={isStarting}
                    >
                        {isStarting ? '...' : 'Customize Session'}
                    </GlassButton>
                </div>
            </div>
        </div >
    );
};
