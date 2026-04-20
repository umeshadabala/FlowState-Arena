import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { deriveStatus } from '../utils/logic';

function getColor(congestion) {
    if (congestion <= 40) return { bg: 'bg-cyan-400/15', border: 'border-cyan-400/40', text: 'text-cyan-400', glow: 'shadow-cyan-400/20' };
    if (congestion <= 75) return { bg: 'bg-yellow-400/15', border: 'border-yellow-400/40', text: 'text-yellow-400', glow: 'shadow-yellow-400/20' };
    return { bg: 'bg-fuchsia-500/20', border: 'border-fuchsia-500/50', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/30' };
}

/**
 * @component StadiumGrid
 * @description A performance-optimized grid representing venue sections.
 * Uses React.memo to prevent expensive re-renders from the 1s state heartbeat.
 */
const StadiumGrid = memo(({ zones }) => {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <div className="glass rounded-xl p-4 h-full" role="region" aria-label="Stadium Section Density Grid">
            {/* Header */}
            <header className="flex items-center justify-between mb-4">
                <div className="section-header">
                    <div className="w-1 h-5 rounded-full bg-cyan-400" aria-hidden="true" />
                    <LayoutGrid className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                    <span>Venue Grid — Digital Twin</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30" role="status" aria-label="System is Live">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 live-dot" aria-hidden="true" />
                    <span className="text-[9px] font-bold text-rose-400 font-mono">LIVE</span>
                </div>
            </header>

            {/* 6x6 Grid */}
            <div
                className="grid grid-cols-6 gap-1.5 md:gap-2"
                role="img"
                aria-label="Grid visualization of stadium sections. Colors indicate congestion levels: Cyan for Clear, Yellow for Busy, Magenta for Critical."
            >
                {zones.map((zone) => {
                    const c = getColor(zone.congestion);
                    const status = deriveStatus(zone.congestion);
                    const isHovered = hoveredId === zone.id;
                    const isCritical = status === 'Critical';

                    return (
                        <motion.div
                            key={zone.id}
                            layout
                            onMouseEnter={() => setHoveredId(zone.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onFocus={() => setHoveredId(zone.id)}
                            onBlur={() => setHoveredId(null)}
                            tabIndex={0}
                            role="gridcell"
                            aria-label={`${zone.name}: ${zone.congestion} percent congestion, status ${status}`}
                            className={`
                                relative aspect-square rounded-lg border cursor-pointer
                                transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                                ${c.bg} ${c.border}
                                ${isCritical ? 'zone-critical' : ''}
                                ${isHovered ? `shadow-lg ${c.glow} scale-105 z-10` : ''}
                            `}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Zone content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5" aria-hidden="true">
                                <span className={`text-[7px] md:text-[9px] font-bold leading-tight text-center ${c.text} truncate w-full px-0.5`}>
                                    {zone.name.length > 8 ? zone.name.replace(/\s+/g, '\n').split('\n')[0] : zone.name}
                                </span>
                                <span className={`text-[10px] md:text-xs font-mono font-extrabold ${c.text} mt-0.5`}>
                                    {zone.congestion}%
                                </span>
                            </div>

                            {/* Critical pulse overlay */}
                            {isCritical && (
                                <div className="absolute inset-0 rounded-lg border-2 border-fuchsia-500/60 animate-ping opacity-20" aria-hidden="true" />
                            )}

                            {/* Tooltip */}
                            {isHovered && (
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none" aria-hidden="true">
                                    <div className="glass-strong rounded-lg px-3 py-2 text-center min-w-[110px] shadow-xl">
                                        <div className="text-[10px] font-bold text-white">{zone.name}</div>
                                        <div className={`text-[9px] font-mono mt-0.5 ${c.text}`}>{zone.congestion}% — {status}</div>
                                        <div className="text-[8px] text-slate-500 mt-0.5">
                                            Wait: ~{Math.ceil(zone.congestion / 5)} min
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rotate-45 ${isCritical ? 'bg-fuchsia-900/80' : 'bg-slate-800/90'} mx-auto -mt-1`} />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <footer className="flex items-center justify-center gap-5 mt-4" aria-label="Grid Legend">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400/40 border border-cyan-400/60" aria-hidden="true" />
                    <span className="text-[9px] text-slate-500 font-mono">CLEAR 0-40%</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400/40 border border-yellow-400/60" aria-hidden="true" />
                    <span className="text-[9px] text-slate-500 font-mono">BUSY 41-75%</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-fuchsia-500/40 border border-fuchsia-500/60 zone-critical" aria-hidden="true" />
                    <span className="text-[9px] text-slate-500 font-mono">CRITICAL 76-100%</span>
                </div>
            </footer>
        </div>
    );
});

export default StadiumGrid;
