import React, { useState } from 'react';
import { Shield, Lock, Repeat, Zap, Check, X } from 'lucide-react';

const Tab4Security: React.FC = () => {
  const [verifySignature, setVerifySignature] = useState(false);
  const [processedEvents, setProcessedEvents] = useState<string[]>([]);
  const [simulationLog, setSimulationLog] = useState<{msg: string, type: 'success' | 'error' | 'info'}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateRequest = (duplicate: boolean = false) => {
    setIsProcessing(true);
    const eventId = "evt_12345";
    const timestamp = new Date().toLocaleTimeString();

    setSimulationLog(prev => [{ msg: `[${timestamp}] Incoming Request: ${eventId}`, type: 'info' }, ...prev]);

    setTimeout(() => {
        // 1. Signature Check
        if (verifySignature) {
            setSimulationLog(prev => [{ msg: "Verifying HMAC Signature...", type: 'info' }, ...prev]);
            // Simulate instant check
        } else {
             setSimulationLog(prev => [{ msg: "⚠️ Signature verification skipped (Insecure)", type: 'error' }, ...prev]);
        }

        // 2. Idempotency Check
        if (duplicate && processedEvents.includes(eventId)) {
            setSimulationLog(prev => [
                { msg: `🛑 Duplicate detected (${eventId}). Returning 200 OK without processing.`, type: 'success' },
                ...prev
            ]);
            setIsProcessing(false);
            return;
        }

        // Success Path
        if (!processedEvents.includes(eventId)) {
            setProcessedEvents(prev => [...prev, eventId]);
        }
        
        setSimulationLog(prev => [
            { msg: "✅ Event Processed Successfully. Database Updated.", type: 'success' },
            { msg: "Response sent: 200 OK in 45ms", type: 'info' },
            ...prev
        ]);
        setIsProcessing(false);

    }, verifySignature ? 600 : 300);
  };

  const clearLog = () => {
      setSimulationLog([]);
      setProcessedEvents([]);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Controls & Checklist */}
      <div className="space-y-6">
        <div className="bg-surface p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="text-emerald-500" />
                Security & Reliability
            </h2>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-3">
                        <Lock className={`w-5 h-5 ${verifySignature ? 'text-emerald-500' : 'text-slate-500'}`} />
                        <div>
                            <div className="font-semibold text-slate-200">Verify Signature</div>
                            <div className="text-xs text-slate-500">Validate the request came from the provider.</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setVerifySignature(!verifySignature)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${verifySignature ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${verifySignature ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => simulateRequest(false)}
                        disabled={isProcessing}
                        className="p-4 bg-primary hover:bg-indigo-600 rounded-lg border border-indigo-500/30 flex flex-col items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Zap className="w-6 h-6 text-white" />
                        <span className="font-bold text-sm">Send New Event</span>
                    </button>

                    <button 
                        onClick={() => simulateRequest(true)}
                        disabled={isProcessing}
                        className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 flex flex-col items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Repeat className="w-6 h-6 text-amber-500" />
                        <span className="font-bold text-sm text-amber-500">Simulate Duplicate</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate-700 h-64 overflow-y-auto font-mono text-xs">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
                <span className="text-slate-400 font-bold uppercase">Server Logs</span>
                <button onClick={clearLog} className="text-xs text-rose-400 hover:text-rose-300">Clear</button>
            </div>
            <div className="space-y-2">
                {simulationLog.map((log, i) => (
                    <div key={i} className={`
                        ${log.type === 'success' ? 'text-emerald-400' : ''}
                        ${log.type === 'error' ? 'text-rose-400' : ''}
                        ${log.type === 'info' ? 'text-slate-300' : ''}
                    `}>
                        {log.msg}
                    </div>
                ))}
                {simulationLog.length === 0 && <span className="text-slate-600 italic">Server ready... waiting for requests.</span>}
            </div>
        </div>
      </div>

      {/* Code Visualization */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-500">
              server.js
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <div className="text-slate-500">app.post(<span className="text-emerald-300">'/webhook'</span>, (req, res) =&gt; {'{'}</div>
              
              <div className={`pl-4 py-1 transition-all ${verifySignature ? 'bg-emerald-900/20 border-l-2 border-emerald-500' : 'opacity-30 blur-[1px]'}`}>
                  <div className="text-slate-400">// 1. Verify Signature</div>
                  <div className="text-purple-300">const</div> sig = req.headers[<span className="text-emerald-300">'x-signature'</span>];
                  <div className="text-purple-300">if</div> (!isValid(sig, req.body)) <div className="text-purple-300 inline">return</div> res.sendStatus(<span className="text-rose-300">401</span>);
              </div>

              <div className="h-2"></div>

              <div className="pl-4 border-l-2 border-amber-500/50 bg-amber-900/10">
                  <div className="text-slate-400">// 2. Check Idempotency</div>
                  <div className="text-purple-300">const</div> eventId = req.body.id;
                  <div className="text-purple-300">if</div> (await db.hasProcessed(eventId)) {'{'}
                  <div className="pl-8 text-slate-400">// Already handled, acknowledge receipt</div>
                  <div className="pl-8"><div className="text-purple-300 inline">return</div> res.sendStatus(<span className="text-emerald-300">200</span>);</div>
                  <div className="pl-4">{'}'}</div>
              </div>

              <div className="h-2"></div>

              <div className="pl-4">
                 <div className="text-slate-400">// 3. Process & Respond Quickly</div>
                 <div>await queue.add(req.body);</div>
                 <div>res.sendStatus(<span className="text-emerald-300">200</span>);</div>
              </div>

              <div className="text-slate-500">{'}'});</div>
          </div>
      </div>
    </div>
  );
};

export default Tab4Security;