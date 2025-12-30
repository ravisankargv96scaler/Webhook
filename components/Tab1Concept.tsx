import React, { useState, useEffect } from 'react';
import { Loader2, Bell, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Tab1Concept: React.FC = () => {
  // Polling State
  const [pollCount, setPollCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [pollStatus, setPollStatus] = useState<'idle' | 'checking' | 'ready'>('idle');
  const [pollLogs, setPollLogs] = useState<string[]>([]);

  // Webhook State
  const [webhookTriggered, setWebhookTriggered] = useState(false);
  const [webhookReceived, setWebhookReceived] = useState(false);

  // Polling Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPolling && pollCount < 5) {
      interval = setInterval(() => {
        setPollStatus('checking');
        setPollLogs(prev => [`Request #${pollCount + 1}: Are you ready?`, ...prev].slice(0, 5));
        
        setTimeout(() => {
          if (pollCount === 4) {
            setPollStatus('ready');
            setPollLogs(prev => [`Response: YES! Order Ready.`, ...prev].slice(0, 5));
            setIsPolling(false);
          } else {
            setPollStatus('idle');
            setPollLogs(prev => [`Response: No. (404)`, ...prev].slice(0, 5));
            setPollCount(prev => prev + 1);
          }
        }, 800);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPolling, pollCount]);

  const startPolling = () => {
    setPollCount(0);
    setPollLogs([]);
    setPollStatus('idle');
    setIsPolling(true);
  };

  const triggerWebhook = () => {
    setWebhookTriggered(true);
    setWebhookReceived(false);
    setTimeout(() => {
      setWebhookReceived(true);
      setTimeout(() => setWebhookTriggered(false), 2000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2">The Restaurant Analogy</h2>
        <p className="text-slate-400">
          Understanding the fundamental difference between asking for data repeatedly (Polling) 
          and being told when data is ready (Webhooks).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Polling Simulator */}
        <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-rose-400 flex items-center gap-2">
              <Loader2 className={`w-5 h-5 ${isPolling ? 'animate-spin' : ''}`} />
              Polling Strategy
            </h3>
            <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">Inefficient</span>
          </div>
          
          <div className="p-6 flex-1 flex flex-col items-center justify-between min-h-[300px]">
            <div className="w-full flex justify-between items-center px-4 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500">
                  <span className="text-xs font-bold">Client</span>
                </div>
              </div>

              {/* Traffic Visualizer */}
              <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                {pollStatus === 'checking' && (
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-rose-500 animate-[shimmer_1s_infinite] rounded-full opacity-70" />
                )}
                 {pollStatus === 'checking' && (
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-rose-400 font-mono animate-pulse">
                     GET /status
                   </div>
                 )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500">
                  <span className="text-xs font-bold">Server</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-900 rounded p-3 font-mono text-xs text-slate-300 h-32 overflow-hidden border border-slate-800">
              {pollLogs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('YES') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {log}
                </div>
              ))}
              {pollLogs.length === 0 && <span className="text-slate-600 opacity-50">Log waiting...</span>}
            </div>

            <button
              onClick={startPolling}
              disabled={isPolling}
              className="mt-6 w-full py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
            >
              {isPolling ? 'Polling...' : 'Start Polling Check'}
            </button>
          </div>
        </div>

        {/* Webhook Simulator */}
        <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
              <Bell className={`w-5 h-5 ${webhookTriggered ? 'animate-bounce' : ''}`} />
              Webhook Strategy
            </h3>
            <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">Efficient</span>
          </div>

          <div className="p-6 flex-1 flex flex-col items-center justify-between min-h-[300px]">
             <div className="w-full flex justify-between items-center px-4 mb-8">
              <div className="flex flex-col items-center gap-2 relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${webhookReceived ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-700 border-slate-500'}`}>
                  <span className="text-xs font-bold">Client</span>
                </div>
                 {webhookReceived && (
                  <div className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-[10px] font-bold text-white">1</span>
                  </div>
                )}
              </div>

              {/* Traffic Visualizer */}
              <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full relative">
                {webhookTriggered && !webhookReceived && (
                  <div className="absolute top-0 left-0 h-full w-full">
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-emerald-500 w-4 h-4 rounded-full shadow-[0_0_10px_#10b981] animate-[moveLeft_1s_ease-out_forwards]" />
                  </div>
                )}
                {webhookTriggered && !webhookReceived && (
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-emerald-400 font-mono">
                     POST /webhook
                   </div>
                 )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500">
                  <span className="text-xs font-bold">Server</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-900 rounded p-3 font-mono text-xs text-slate-300 h-32 flex items-center justify-center border border-slate-800">
              {webhookReceived ? (
                <div className="text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-emerald-400">Order Ready Event Received!</p>
                </div>
              ) : webhookTriggered ? (
                <p className="text-slate-500 italic">Transmitting event...</p>
              ) : (
                <p className="text-slate-600 opacity-50">Listening for events...</p>
              )}
            </div>

            <button
              onClick={triggerWebhook}
              disabled={webhookTriggered}
              className="mt-6 w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
            >
              Trigger Event (Order Ready)
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes moveLeft {
          0% { right: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { right: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Tab1Concept;