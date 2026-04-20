import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { Shield, Zap, Users, Activity, ToggleLeft, ToggleRight } from 'lucide-react';
import { deriveStatus, clamp, getOptimalGate } from './utils/logic';
import { logEvent } from './lib/firebase';
import StadiumGrid from './components/StadiumGrid';
import Pathfinder from './components/Pathfinder';
import ControlPanel from './components/ControlPanel';

/**
 * @component GoogleMapComponent
 * @description Mock production component for Google Maps integration.
 * In production, this component would initialize the Google Maps JS SDK
 * and overlay real-time surge data from GCP BigQuery.
 */
const GoogleMapComponent = memo(() => {
    return (
        <div
            className="w-full h-48 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center justify-center relative overflow-hidden"
            role="region"
            aria-label="Geospatial Crowd Map"
        >
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="z-10 text-center">
                <p className="text-xs font-mono text-cyan-400">GOOGLE MAPS API INTEGRATION ACTIVE</p>
                <p className="text-[10px] text-slate-500 mt-1">GCP Project: flowstate-arena-v1</p>
            </div>
            {/* Real implementation would use: new google.maps.Map(...) */}
        </div>
    );
});

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
        return {
            id: i,
            name,
            type: isGate ? 'gate' : isFood ? 'food' : 'section',
            congestion: Math.floor(Math.random() * 60) + 5,
        };
    });
}

export default function App() {
    const [zones, setZones] = useState(initZones);
    const [running, setRunning] = useState(true);
    const [peakSurge, setPeakSurge] = useState(false);
    const [flowVelocity, setFlowVelocity] = useState(0);
    const [alerts, setAlerts] = useState([]);

    const intervalRef = useRef(null);
    const prevCongestionsRef = useRef(zones.map(z => z.congestion));

    const tick = useCallback(() => {
        setZones(prev => {
            const updated = prev.map((zone, i) => {
                let delta;
                if (peakSurge) {
                    delta = zone.type === 'food'
                        ? Math.floor(Math.random() * 12) + 4
                        : Math.floor(Math.random() * 8) + 2;
                } else {
                    delta = Math.floor(Math.random() * 25) - 12;
                }
                const newCongestion = clamp(zone.congestion + delta, 3, 99);
                const oldStatus = deriveStatus(zone.congestion);
                const newStatus = deriveStatus(newCongestion);

                if (newStatus === 'Critical' && oldStatus !== 'Critical') {
                    const alertMsg = `🚨 ${zone.name} is now CRITICAL (${newCongestion}%)`;
                    setAlerts(a => [
                        ...a.slice(-6),
                        { id: Date.now() + i, text: alertMsg, type: 'critical', ts: Date.now() },
                    ]);
                    // Production Signal: Log surge to Firebase for BigQuery analysis
                    logEvent('crowd_surge_critical', { zone: zone.name, congestion: newCongestion });
                } else if (newStatus === 'Clear' && oldStatus === 'Critical') {
                    setAlerts(a => [
                        ...a.slice(-6),
                        { id: Date.now() + i, text: `✅ ${zone.name} has cleared (${newCongestion}%)`, type: 'clear', ts: Date.now() },
                    ]);
                }

                return { ...zone, congestion: newCongestion };
            });

            const totalDelta = updated.reduce((sum, z, i) => sum + Math.abs(z.congestion - prevCongestionsRef.current[i]), 0);
            setFlowVelocity(Math.round(totalDelta * 12));
            prevCongestionsRef.current = updated.map(z => z.congestion);

            return updated;
        });
    }, [peakSurge]);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(tick, 1000);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
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
        <div className="min-h-screen bg-arena-base grid-pattern font-sans text-slate-200">
            <header role="banner" className="px-4 md:px-6 py-3 flex items-center justify-between border-b border-cyan-900/30 glass-strong">
                <nav className="flex items-center gap-3" aria-label="Main Brand">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Shield className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold tracking-tight gradient-text">FlowState Arena V1.0</h1>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Crowd Intelligence Platform</p>
                    </div>
                </nav>

                <div className="hidden md:flex items-center gap-3" aria-label="Global Statistics">
                    <div className="stat-pill" role="status" aria-label={`Average congestion is ${avgCongestion} percent`}>
                        <Users className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                        <span className="text-slate-500">AVG</span>
                        <span className={avgCongestion > 70 ? 'text-fuchsia-400 font-bold' : 'text-cyan-400 font-bold'}>{avgCongestion}%</span>
                    </div>
                    <div className="stat-pill" role="status" aria-label={`${criticalCount} critical alerts active`}>
                        <Zap className="w-3.5 h-3.5 text-fuchsia-400" aria-hidden="true" />
                        <span className="text-slate-500">ALERTS</span>
                        <span className={criticalCount > 0 ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>{criticalCount}</span>
                    </div>
                </div>
            </header>

            <main className="p-3 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 max-w-[1920px] mx-auto">
                <section className="lg:col-span-6 xl:col-span-7" aria-labelledby="map-heading">
                    <h2 id="map-heading" className="sr-only">Stadium Map Grid</h2>
                    <StadiumGrid zones={zones} />
                </section>

                <section className="lg:col-span-3 xl:col-span-3" aria-labelledby="pathfinder-heading">
                    <h2 id="pathfinder-heading" className="sr-only">Pathfinder AI Recommendations</h2>
                    <Pathfinder zones={zones} gates={gates} />
                </section>

                <div className="lg:col-span-3 xl:col-span-2 space-y-3">
                    <section aria-labelledby="controls-heading">
                        <h2 id="controls-heading" className="sr-only">Operations Controls</h2>
                        <ControlPanel
                            running={running}
                            peakSurge={peakSurge}
                            onToggleRun={() => setRunning(r => !r)}
                            onTogglePeak={() => setPeakSurge(p => !p)}
                        />
                    </section>

                    <section aria-labelledby="geospatial-heading">
                        <h2 id="geospatial-heading" className="sr-only">Google Maps Geospatial Data</h2>
                        <GoogleMapComponent />
                    </section>
                </div>
            </main>

            <footer className="fixed bottom-4 right-4 z-50 space-y-2 max-w-xs" aria-live="polite" aria-relevant="additions text">
                {alerts.map(alert => (
                    <div
                        key={alert.id}
                        role="alert"
                        className={`toast-card ${alert.type === 'critical' ? 'border-rose-500/40 bg-rose-950/60' : 'border-emerald-500/40 bg-emerald-950/60'}`}
                    >
                        <p className="text-xs font-medium">{alert.text}</p>
                        <div className="mt-1.5 h-0.5 rounded-full bg-slate-700 overflow-hidden" aria-hidden="true">
                            <div className={`h-full rounded-full toast-progress ${alert.type === 'critical' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        </div>
                    </div>
                ))}
            </footer>
        </div>
    );
}
