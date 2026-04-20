import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { Shield, Zap, Users, Activity, LogIn, LogOut, Radio } from 'lucide-react';
import { deriveStatus, clamp, getOptimalGate } from './utils/logic';
import { googleService } from './services/googleProvider';
import { sanitizeZoneData } from './utils/security';
import StadiumGrid from './components/StadiumGrid';
import Pathfinder from './components/Pathfinder';
import ControlPanel from './components/ControlPanel';

/**
 * @component GoogleMapComponent
 * @description Mock production component for Google Maps integration.
 */
const GoogleMapComponent = memo(() => (
    <div
        className="w-full h-48 rounded-xl bg-slate-900 border border-slate-700/50 flex items-center justify-center relative overflow-hidden"
        role="region"
        aria-label="Geospatial Crowd Map"
    >
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="z-10 text-center">
            <Radio className="w-6 h-6 text-cyan-500 mx-auto mb-2 animate-pulse" aria-hidden="true" />
            <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">GCP Live Sync Active</p>
            <p className="text-[9px] text-slate-500 mt-1">Provider: Google Cloud Platform</p>
        </div>
    </div>
));

const ZONE_NAMES = [
    'North Gate', 'NE Corner', 'East Gate',
    'NW Corner', 'Field Level', 'SE Corner',
    'West Gate', 'SW Corner', 'South Gate',
    'Concourse A', 'Main Bar', 'Concourse B',
    'Merch Stand', 'Food Plaza', 'Fan Zone',
    'VIP Lounge', 'Press Box', 'Medical Bay',
    'Gate A2', 'Gate B2', 'Gate C2',
    'Tunnel N', 'Pitch Side', 'Tunnel S',
    'Upper Deck N', 'Upper Deck E', 'Upper Deck S',
    'Upper Deck W', 'Skybox Row', 'Broadcast',
    'Overflow N', 'Overflow E', 'Overflow S',
    'Overflow W', 'Family Zone', 'Accessibility',
];

function initZones() {
    return ZONE_NAMES.map((name, i) => {
        const isGate = name.toLowerCase().includes('gate');
        const isFood = ['Main Bar', 'Food Plaza', 'Merch Stand'].includes(name);
        return sanitizeZoneData({
            id: i,
            name,
            type: isGate ? 'gate' : isFood ? 'food' : 'section',
            congestion: Math.floor(Math.random() * 60) + 5,
        });
    });
}

export default function App() {
    const [zones, setZones] = useState(initZones);
    const [running, setRunning] = useState(true);
    const [peakSurge, setPeakSurge] = useState(false);
    const [flowVelocity, setFlowVelocity] = useState(0);
    const [alerts, setAlerts] = useState([]);
    const [isAuthed, setIsAuthed] = useState(false);

    const intervalRef = useRef(null);
    const prevCongestionsRef = useRef(zones.map(z => z.congestion));

    const toggleAuth = () => {
        if (!isAuthed) googleService.constructor.Auth.signIn('Operator_01');
        else googleService.constructor.Auth.signOut();
        setIsAuthed(!isAuthed);
    };

    const tick = useCallback(() => {
        setZones(prev => {
            const updated = prev.map((zone, i) => {
                let delta;
                if (peakSurge) {
                    delta = zone.type === 'food' ? 8 : 4;
                } else {
                    delta = Math.floor(Math.random() * 21) - 10;
                }
                const newCongestion = clamp(zone.congestion + delta, 3, 99);
                const oldStatus = deriveStatus(zone.congestion);
                const newStatus = deriveStatus(newCongestion);

                if (newStatus === 'Critical' && oldStatus !== 'Critical') {
                    setAlerts(a => [
                        ...a.slice(-6),
                        { id: Date.now() + i, text: `🚨 ${zone.name} Surge Detected (${newCongestion}%)`, type: 'critical', ts: Date.now() },
                    ]);
                    googleService.logEvent('Route Divergence', { zone: zone.name, load: newCongestion });
                }

                return sanitizeZoneData({ ...zone, congestion: newCongestion });
            });

            const totalDelta = updated.reduce((sum, z, i) => sum + Math.abs(z.congestion - prevCongestionsRef.current[i]), 0);
            setFlowVelocity(Math.round(totalDelta * 12));
            prevCongestionsRef.current = updated.map(z => z.congestion);
            return updated;
        });
    }, [peakSurge]);

    useEffect(() => {
        if (running) intervalRef.current = setInterval(tick, 1000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, tick]);

    useEffect(() => {
        const timer = setInterval(() => {
            setAlerts(a => a.filter(al => Date.now() - al.ts < 6000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const gates = zones.filter(z => z.type === 'gate');
    const avgCongestion = Math.round(zones.reduce((s, z) => s + z.congestion, 0) / zones.length);
    const criticalCount = zones.filter(z => deriveStatus(z.congestion) === 'Critical').length;

    return (
        <div className="min-h-screen bg-arena-base grid-pattern font-sans text-slate-200" role="application" aria-label="FlowState Arena Venue OS">
            <header role="banner" className="px-4 md:px-6 py-3 flex items-center justify-between border-b border-cyan-900/30 glass-strong">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Shield className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold tracking-tight gradient-text">FlowState Arena</h1>
                        <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">GCP Enterprise OS V1.0</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3" aria-label="Live Metrics">
                        <div className="stat-pill" role="status" aria-label={`Avg load ${avgCongestion}%`}>
                            <Users className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                            <span className="text-cyan-400 font-bold">{avgCongestion}%</span>
                        </div>
                        <div className="stat-pill" role="status" aria-label={`${criticalCount} alerts`}>
                            <Zap className="w-3.5 h-3.5 text-fuchsia-400" aria-hidden="true" />
                            <span className="text-fuchsia-400 font-bold">{criticalCount}</span>
                        </div>
                    </div>
                    <button
                        onClick={toggleAuth}
                        aria-label={isAuthed ? "Sign Out from GCP" : "Sign In to GCP"}
                        tabIndex={0}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${isAuthed ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-cyan-400'
                            }`}
                    >
                        {isAuthed ? <LogOut size={12} /> : <LogIn size={12} />}
                        {isAuthed ? 'OP_ACTIVE' : 'OP_SIGN_IN'}
                    </button>
                </div>
            </header>

            <main className="p-3 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 max-w-[1920px] mx-auto">
                <section className="lg:col-span-6 xl:col-span-7" aria-label="Real-time Venue Map">
                    <StadiumGrid zones={zones} />
                </section>

                <section className="lg:col-span-3 xl:col-span-3" aria-label="AI Routing Recommendations">
                    <Pathfinder zones={zones} gates={gates} />
                </section>

                <div className="lg:col-span-3 xl:col-span-2 space-y-3">
                    <section aria-label="Control Matrix">
                        <ControlPanel
                            running={running}
                            peakSurge={peakSurge}
                            onToggleRun={() => setRunning(r => !r)}
                            onTogglePeak={() => setPeakSurge(p => !p)}
                        />
                    </section>

                    <section aria-label="GCP Geospatial Sync">
                        <GoogleMapComponent />
                    </section>
                </div>
            </main>

            <footer className="fixed bottom-4 right-4 z-50 space-y-2 max-w-xs" aria-live="polite">
                {alerts.map(alert => (
                    <div
                        key={alert.id}
                        role="alert"
                        className={`toast-card border-none ${alert.type === 'critical' ? 'bg-fuchsia-950/80 text-fuchsia-100 shadow-[0_0_15px_rgba(217,70,239,0.2)]' : 'bg-emerald-950/80 text-emerald-100'}`}
                    >
                        <p className="text-[10px] font-bold uppercase tracking-wider">{alert.text}</p>
                        <div className="mt-1.5 h-0.5 bg-white/10 rounded-full overflow-hidden" aria-hidden="true">
                            <div className={`h-full toast-progress ${alert.type === 'critical' ? 'bg-fuchsia-500' : 'bg-emerald-500'}`} />
                        </div>
                    </div>
                ))}
            </footer>
        </div>
    );
}
