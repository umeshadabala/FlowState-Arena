import React from 'react';
import { Play, Square, Flame, Radio } from 'lucide-react';

export default function ControlPanel({ running, peakSurge, onToggleRun, onTogglePeak }) {
    return (
        <div className="glass rounded-xl p-3">
            <div className="section-header mb-3">
                <div className="w-1 h-5 rounded-full bg-fuchsia-500" />
                <Radio className="w-4 h-4 text-fuchsia-400" />
                <span>Control Matrix</span>
            </div>

            <div className="space-y-2">
                {/* Start / Stop */}
                <button
                    onClick={onToggleRun}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all duration-300 ${running
                            ? 'bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25'
                            : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                        }`}
                >
                    {running ? (
                        <>
                            <Square className="w-3.5 h-3.5" />
                            Stop Real-Time
                        </>
                    ) : (
                        <>
                            <Play className="w-3.5 h-3.5" />
                            Start Real-Time
                        </>
                    )}
                </button>

                {/* Peak Surge */}
                <button
                    onClick={onTogglePeak}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all duration-300 ${peakSurge
                            ? 'bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/30 animate-glow-magenta'
                            : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/30'
                        }`}
                >
                    <Flame className="w-3.5 h-3.5" />
                    {peakSurge ? '⚡ Peak Surge Active' : 'Peak Surge'}
                </button>
            </div>

            {/* Status indicator */}
            <div className="mt-3 flex items-center justify-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-emerald-400 live-dot' : 'bg-slate-600'}`} />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {running ? (peakSurge ? 'SURGE MODE' : 'MONITORING') : 'PAUSED'}
                </span>
            </div>
        </div>
    );
}
