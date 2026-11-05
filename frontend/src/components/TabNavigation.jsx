import React from 'react';
import { 
  LayoutDashboard, 
  Cigarette, 
  Users, 
  TableProperties, 
  Code2,
  FileText
} from 'lucide-react';

export default function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'overview',
      label: 'Executive Overview & KPIs',
      subtitle: 'Objectives 1 & 2',
      icon: LayoutDashboard
    },
    {
      id: 'patterns',
      label: 'Smoking & Health Indicators',
      subtitle: 'Objective 3',
      icon: Cigarette
    },
    {
      id: 'demographics',
      label: 'Demographics & Exposure',
      subtitle: 'Objective 4',
      icon: Users
    },
    {
      id: 'patients',
      label: 'Patient Data Explorer',
      subtitle: '10,000 Records',
      icon: TableProperties
    },
    {
      id: 'dax',
      label: 'DAX & Model Reference',
      subtitle: 'Power BI Code',
      icon: Code2
    }
  ];

  return (
    <div className="bg-slate-100/80 border-b border-slate-200 sticky top-[108px] z-20 backdrop-blur-xs no-print">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="leading-tight">{tab.label}</div>
                  <div className={`text-[10px] font-normal ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
