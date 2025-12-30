import React, { useState } from 'react';
import { TabId } from './types';
import Tab1Concept from './components/Tab1Concept';
import Tab2Lifecycle from './components/Tab2Lifecycle';
import Tab3Anatomy from './components/Tab3Anatomy';
import Tab4Security from './components/Tab4Security';
import Tab5Architecture from './components/Tab5Architecture';
import Tab6Quiz from './components/Tab6Quiz';
import { Radio, Activity, Code2, Lock, Network, GraduationCap, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.CONCEPT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case TabId.CONCEPT: return <Tab1Concept />;
      case TabId.LIFECYCLE: return <Tab2Lifecycle />;
      case TabId.ANATOMY: return <Tab3Anatomy />;
      case TabId.SECURITY: return <Tab4Security />;
      case TabId.ARCHITECTURE: return <Tab5Architecture />;
      case TabId.QUIZ: return <Tab6Quiz />;
      default: return <Tab1Concept />;
    }
  };

  const navItems = [
    { id: TabId.CONCEPT, label: "Concept", icon: <Radio className="w-4 h-4" /> },
    { id: TabId.LIFECYCLE, label: "Lifecycle", icon: <Activity className="w-4 h-4" /> },
    { id: TabId.ANATOMY, label: "Request Anatomy", icon: <Code2 className="w-4 h-4" /> },
    { id: TabId.SECURITY, label: "Security", icon: <Lock className="w-4 h-4" /> },
    { id: TabId.ARCHITECTURE, label: "Architecture", icon: <Network className="w-4 h-4" /> },
    { id: TabId.QUIZ, label: "Quiz", icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col md:flex-row font-sans selection:bg-primary/30">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-surface border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Webhook Mastery</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop) / Dropdown (Mobile) */}
      <nav className={`
        fixed md:sticky top-0 left-0 h-[calc(100vh-64px)] md:h-screen w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 z-40 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0 mt-16 md:mt-0' : '-translate-x-full md:translate-x-0'}
        md:flex flex-col
      `}>
        <div className="p-6 hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Webhook Mastery</h1>
          </div>
          <p className="text-xs text-slate-500 ml-5">Interactive Guide</p>
        </div>

        <div className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800 text-xs text-slate-600">
           &copy; 2023 Webhook Edu
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full md:h-screen md:overflow-y-auto custom-scrollbar">
        {renderContent()}
      </main>

    </div>
  );
};

export default App;
