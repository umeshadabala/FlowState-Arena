import React, { useMemo, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, AlertTriangle, Ticket, ArrowRight, Copy, CheckCircle2, Route, Sparkles, TrendingDown } from 'lucide-react';
import { getOptimalGate, getIncentiveReward } from '../utils/logic';

/**
 * @component Pathfinder
 * @description Smart rerouting module with A11y and performance optimizations.
 */
const Pathfinder = memo(({ zones, gates }) => {
    const [copiedCode, setCopiedCode] = useState(false);

    const analysis = useMemo(() => {
        const sorted = [...gates].sort((a, b) => a.congestion - b.congestion);
        const best = getOptimalGate(gates);
        const worst = sorted[sorted.length - 1];
        const criticals = gates.filter(g => g.congestion > 70);
        const needsReroute = worst && worst.congestion > 70;
        return { best, worst, sorted, criticals, needsReroute };
    }, [gates]);

    const nudges = useMemo(() => {
        const n = [];
        const criticalZones = zones.filter(z => z.congestion > 75);
        const clearZones = zones.filter(z => z.congestion <= 40);

        criticalZones.slice(0, 3).forEach(cz => {
            const target = clearZones[0];
            if (target) {
                n.push({
                    id: cz.id,
                    from: cz.name,
                    to: target.name,
                    fromPct: cz.congestion,
                    toPct: target.congestion,
                    reward: getIncentiveReward(cz.type),
                });
            }
        });
        return n;
    }, [zones]);

    const handleCopy = () => {
        navigator.clipboard?.writeText('ARENA-FLOW-15').catch(() => { });
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    return (
        <div className="space-y-3 h-full flex flex-col" role="region" aria-label="Crowd Routing System">
            {/* Header */}
            <header className="section-header">
                <div className="w-1 h-5 rounded-full bg-fuchsia-500" aria-hidden="true" />
                <Sparkles className="w-4 h-4 text-fuchsia-400" aria-hidden="true" />
                <span>Pathfinder AI</span>
            </header>

            {/* Optimal Gate */}
            <section className="glass rounded-xl p-3" aria-labelledby="best-gate-title">
                <div className="flex items-center gap-1.5 mb-2">
                    <Route className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                    <span id="best-gate-title" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended Entry</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-base font-bold text-white">{analysis.best?.name || '—'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                            Load: <span className="text-cyan-400 font-bold">{analysis.best?.congestion}%</span>
                            <span className="text-slate-600 mx-1">|</span>
                            Wait: <span className="text-cyan-400">{Math.ceil((analysis.best?.congestion || 0) / 5)} min</span>
                        </div>
                    </div>
                    <div className="w-11 h-11 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-cyan-400" aria-label="Navigate Icon" />
                    </div>
                </div>

                {/* Ranking */}
                <div className="mt-3 space-y-1" role="list" aria-label="Gate load rankings">
                    {analysis.sorted.map((gate, i) => {
                        const pct = gate.congestion;
                        const color = pct <= 40 ? 'text-cyan-400' : pct <= 75 ? 'text-yellow-400' : 'text-fuchsia-400';
                        return (
                            <div
                                key={gate.id}
                                role="listitem"
                                className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-800/40 transition-colors"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[10px] font-mono font-bold ${color}`}>#{i + 1}</span>
                                    <span className="text-xs text-slate-400">{gate.name}</span>
                                </div>
                                <span className={`text-[10px] font-mono font-bold ${color}`} aria-label={`${pct} percent load`}>{pct}%</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Nudge Feed */}
            <section className="flex-1 overflow-y-auto space-y-2 pr-0.5" aria-label="Real-time reroute suggestions">
                <AnimatePresence mode="popLayout">
                    {nudges.length > 0 ? nudges.map((nudge) => (
                        <motion.article
                            key={nudge.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="rounded-lg p-3 border border-fuchsia-500/30 bg-fuchsia-950/30 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <AlertTriangle className="w-3 h-3 text-fuchsia-400" aria-hidden="true" />
                                <span className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest">Smart Reroute</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                <span className="text-white font-semibold">{nudge.from}</span>
                                <span className="text-fuchsia-400 font-mono"> ({nudge.fromPct}%)</span>
                                <span aria-hidden="true"> → </span>
                                <span className="text-cyan-400 font-semibold">{nudge.to}</span>
                                <span className="text-cyan-400 font-mono"> ({nudge.toPct}%)</span>
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[9px] text-slate-500 italic">{nudge.reward}</span>
                                <TrendingDown className="w-3 h-3 text-emerald-400" aria-label="Flow distributed" />
                            </div>
                        </motion.article>
                    )) : (
                        <motion.div
                            key="all-clear"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass rounded-lg p-3 border-emerald-500/20"
                            role="status"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-tight">Optimal Flow</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">Crowd distribution is balanced across all monitored zones.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Discount Code */}
            {analysis.needsReroute && (
                <section className="rounded-lg bg-gradient-to-r from-cyan-400/5 to-fuchsia-500/5 border border-cyan-400/20 p-3" aria-label="Redistribution Incentive">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Ticket className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                        <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Nudge Incentive</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2">
                        Receive a <span className="text-white font-bold">15% OFF</span> digital voucher by switching to the recommended gate.
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono text-center py-1.5 px-2 rounded-md bg-slate-900/80 border border-cyan-400/20 text-cyan-400 font-bold tracking-widest">
                            ARENA-FLOW-15
                        </code>
                        <button
                            onClick={handleCopy}
                            aria-label="Copy discount code ARENA-FLOW-15"
                            className="p-1.5 rounded-md bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
                        >
                            {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
});

export default Pathfinder;
