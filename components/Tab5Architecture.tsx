import React, { useState, useEffect, useRef } from 'react';
import { Database, Server, Layers, HardDrive } from 'lucide-react';

interface QueueItem {
  id: number;
}

const Tab5Architecture: React.FC = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [workers, setWorkers] = useState<{id: number, busy: boolean}[]>([
    {id: 1, busy: false},
    {id: 2, busy: false},
    {id: 3, busy: false}
  ]);
  const [dbCount, setDbCount] = useState(0);
  const nextId = useRef(0);

  // Queue Processing Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkers(prevWorkers => {
        // Create a copy to modify
        const newWorkers = [...prevWorkers];
        let queueProcessed = false;

        newWorkers.forEach(worker => {
          if (!worker.busy && queue.length > 0 && !queueProcessed) {
            // Found a free worker and work to do
            worker.busy = true;
            queueProcessed = true;
            
            // "Finish" work after delay
            setTimeout(() => {
              setWorkers(ws => ws.map(w => w.id === worker.id ? {...w, busy: false} : w));
              setDbCount(c => c + 1);
            }, 1000);
          }
        });

        // Mutating queue inside setState is tricky, so we handle the shift here visually/logically
        // But for React state, we need to splice the queue if we assigned a worker
        if (queueProcessed) {
           setQueue(q => q.slice(1));
        }

        return newWorkers;
      });
    }, 500); // Check for work every 500ms

    return () => clearInterval(interval);
  }, [queue, workers]);

  const floodEvents = () => {
    const newItems: QueueItem[] = Array.from({ length: 10 }).map(() => ({
      id: nextId.current++
    }));
    setQueue(prev => [...prev, ...newItems]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-lg flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Scalable Infrastructure</h2>
                <p className="text-slate-400 text-sm">
                Don't process heavy logic in the webhook handler. 
                <br/>Acknowledge immediately, push to a queue, and let workers process asynchronously.
                </p>
            </div>
            <button 
                onClick={floodEvents}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg active:scale-95 transition-transform"
            >
                Flood (10 Events)
            </button>
        </div>

        {/* Architecture Diagram */}
        <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-8 min-h-[400px] flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
            
            {/* Background Flow Lines */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-0"></div>

            {/* Stage 1: Endpoint */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-24 h-24 bg-surface border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center shadow-xl">
                    <Server className="w-8 h-8 text-slate-400" />
                    <span className="text-xs font-bold mt-2 text-slate-300">Endpoint</span>
                </div>
                <div className="text-xs text-slate-500">Receives & Acks</div>
            </div>

            {/* Stage 2: Message Queue */}
            <div className="relative z-10 flex-1 w-full max-w-xs">
                <div className="bg-slate-800 border-2 border-primary/50 rounded-lg h-24 flex items-center px-2 gap-1 overflow-hidden relative shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <div className="absolute top-1 left-2 text-[10px] text-primary font-bold uppercase tracking-wider">Message Queue (SQS/Kafka)</div>
                    
                    {/* Queue Items */}
                    <div className="flex gap-1 items-center w-full overflow-x-auto pt-4">
                        {queue.map((item) => (
                            <div key={item.id} className="min-w-[12px] h-12 bg-primary rounded-sm animate-in zoom-in duration-300"></div>
                        ))}
                         {queue.length === 0 && <span className="text-slate-600 text-xs w-full text-center">Empty</span>}
                    </div>
                    
                    {/* Queue Count Badge */}
                    <div className="absolute bottom-1 right-2 text-xs font-mono text-white bg-primary px-1 rounded">
                        {queue.length} Pending
                    </div>
                </div>
            </div>

            {/* Stage 3: Worker Pool */}
            <div className="relative z-10 flex flex-col gap-4">
                <div className="text-center text-xs text-slate-500 font-bold uppercase mb-1">Worker Pool</div>
                {workers.map((worker) => (
                    <div 
                        key={worker.id}
                        className={`w-32 h-12 rounded-md border flex items-center justify-center gap-2 transition-all duration-300
                            ${worker.busy 
                                ? 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                                : 'bg-surface border-slate-700 opacity-50'}
                        `}
                    >
                        <HardDrive className={`w-4 h-4 ${worker.busy ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                        <span className={`text-xs font-mono ${worker.busy ? 'text-emerald-300' : 'text-slate-500'}`}>
                            {worker.busy ? 'Processing...' : 'Idle'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Stage 4: Database */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className="w-24 h-24 bg-surface border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center shadow-xl relative">
                    <Database className="w-8 h-8 text-amber-500" />
                    <span className="text-xs font-bold mt-2 text-slate-300">Database</span>
                    
                    {/* Record Counter */}
                    <div className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {dbCount}
                    </div>
                </div>
                <div className="text-xs text-slate-500">Persisted Data</div>
            </div>
        </div>
    </div>
  );
};

export default Tab5Architecture;
