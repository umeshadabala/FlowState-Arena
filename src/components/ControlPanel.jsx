import React, { memo } from 'react';
import { Play, Square, Flame, Radio } from 'lucide-react';

/**
 * @component ControlPanel
 * @description Operations interface with A11y labels and focus states.
 */
const ControlPanel = memo(({ running, peakSurge, onToggleRun, onTogglePeak }) => {
    return (
        <section className="glass rounded-xl p-3" aria-label="System Operations">
            <header className="section-header mb-3">
                <div className="w-1 h-5 rounded-full bg-fuchsia-500" aria-hidden="true" />
                <Radio className="w-4 h-4 text-fuchsia-400" aria-hidden="true" />
                <span>Control Matrix</span>
            </header>

            <div className="space-y-2">
                {/* Start / Stop */}
                <button
                    onClick={onToggleRun}
                    aria-label={running ? "Stop real-time simulation" : "Start real-time simulation"}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all duration-300 outline-none focus-visible:ring-2 ${running
                            ? 'bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25 focus-visible:ring-rose-500'
                            : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 focus-visible:ring-emerald-500'
                        }`}
                >
                    {running ? (
                        <>
                            <Square className="w-3.5 h-3.5" aria-hidden="true" />
                            Stop Real-Time
                        </>
                    ) : (
                        <>
                            <Play className="w-3.5 h-3.5" aria-hidden="true" />
                            Start Real-Time
                        </>
                    )}
                </button>

                {/* Peak Surge */}
                <button
                    onClick={onTogglePeak}
                    aria-label={peakSurge ? "Disable peak surge simulation" : "Enable peak surge simulation"}
                    aria-pressed={peakSurge}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all duration-300 outline-none focus-visible:ring-2 ${peakSurge
                            ? 'bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/30 animate-glow-magenta focus-visible:ring-fuchsia-500'
                            : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/30 focus-visible:ring-fuchsia-500'
                        }`}
                >
                    <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                    {peakSurge ? '⚡ Peak Surge Active' : 'Peak Surge'}
                </button>
            </div>

            {/* Status indicator */}
            <footer className="mt-3 flex items-center justify-center gap-1.5" role="status">
                <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-emerald-400 live-dot' : 'bg-slate-600'}`} aria-hidden="true" />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {running ? (peakSurge ? 'SURGE MODE' : 'MONITORING') : 'PAUSED'}
                </span>
            </footer>
        </section>
    );
});

export default ControlPanel;
