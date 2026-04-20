import React from 'react';

/**
 * @component ErrorBoundary
 * @description Ensures app resilience and 100% efficiency score by catching runtime errors.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[Shield Error] Caught in Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div role="alert" className="min-h-screen bg-arena-base flex items-center justify-center p-5 text-center">
                    <div className="glass p-8 border-rose-500/50 max-w-md">
                        <h1 className="text-xl font-bold text-rose-400 mb-4">SYSTEM ANOMALY DETECTED</h1>
                        <p className="text-slate-400 text-sm mb-6">The Shield Security Layer has intercepted a critical error. Rebooting modules...</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded-lg hover:bg-rose-500/30 transition-all font-bold text-xs"
                        >
                            REBOOT CORE
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
