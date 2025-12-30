import React, { useState, useEffect } from 'react';
import { Settings, Globe, Server, Code, FileJson, ArrowRight, Check } from 'lucide-react';

const Tab2Lifecycle: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      if (step < 4) {
        timer = setTimeout(() => {
          setStep(prev => prev + 1);
        }, 1500);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const startSimulation = () => {
    setStep(0);
    setIsPlaying(true);
  };

  const steps = [
    {
      id: 1,
      title: "Registration",
      desc: "You give the Provider your URL.",
      icon: <Settings className="w-6 h-6" />,
      detail: "POST https://api.github.com/hooks"
    },
    {
      id: 2,
      title: "Event Occurs",
      desc: "Something happens on the Provider.",
      icon: <Globe className="w-6 h-6" />,
      detail: "User opens a Pull Request"
    },
    {
      id: 3,
      title: "Provider POSTs",
      desc: "Provider sends payload to your URL.",
      icon: <Server className="w-6 h-6" />,
      detail: "POST https://yourapp.com/webhooks"
    },
    {
      id: 4,
      title: "Processing",
      desc: "Your server receives & acts.",
      icon: <Code className="w-6 h-6" />,
      detail: "200 OK - CI/CD Triggered"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2">The Webhook Lifecycle</h2>
        <p className="text-slate-400">
          A webhook isn't magic. It's a standard HTTP request triggered by a specific lifecycle of events.
        </p>
      </div>

      {/* Animation Stage */}
      <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-700 relative min-h-[300px] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Connection Line */}
        <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-700 -translate-y-1/2 z-0" />
        
        {/* Animated Payload Packet */}
        <div 
          className={`absolute top-1/2 z-20 -translate-y-1/2 transition-all duration-1000 ease-in-out
            ${step === 0 ? 'left-[10%] opacity-0' : ''}
            ${step === 1 ? 'left-[15%] opacity-100' : ''}
            ${step === 2 ? 'left-[40%] opacity-100' : ''}
            ${step === 3 ? 'left-[65%] opacity-100' : ''}
            ${step === 4 ? 'left-[90%] opacity-0' : ''}
          `}
        >
          <div className="bg-primary text-white p-2 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            <span className="text-xs font-bold">Payload</span>
          </div>
        </div>

        {/* Steps Nodes */}
        <div className="relative z-10 w-full flex justify-between px-4 md:px-12">
          {steps.map((s, index) => {
            const isActive = step >= s.id;
            const isCurrent = step === s.id;

            return (
              <div key={s.id} className="flex flex-col items-center gap-4 w-40 text-center group">
                <div 
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-500 bg-surface shadow-xl
                    ${isActive ? 'border-primary text-primary scale-110' : 'border-slate-700 text-slate-500 scale-100'}
                    ${isCurrent ? 'ring-4 ring-primary/20 animate-pulse' : ''}
                  `}
                >
                  {s.icon}
                </div>
                <div className={`transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'}`}>
                  <h4 className={`font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{s.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-tight">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Indicator at Bottom */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
             <div className="inline-block bg-slate-800 px-4 py-2 rounded-full border border-slate-600 text-sm font-mono text-primary">
                {step === 0 ? 'Ready to Start' : steps[step - 1]?.detail || 'Completed'}
             </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={startSimulation}
          disabled={isPlaying && step < 4}
          className={`
            px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2 transition-all shadow-lg
            ${isPlaying && step < 4
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-indigo-400 text-white hover:scale-105 active:scale-95'}
          `}
        >
           {step === 4 ? (
             <>
               <ArrowRight className="w-5 h-5" /> Reset & Replay
             </>
           ) : isPlaying ? (
             <>Processing Step {step}...</>
           ) : (
             <>
               <ArrowRight className="w-5 h-5" /> Start Simulation
             </>
           )}
        </button>
      </div>
    </div>
  );
};

export default Tab2Lifecycle;