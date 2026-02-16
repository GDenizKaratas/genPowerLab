import {
  Cpu,
  Settings2,
  SlidersHorizontal
} from '../icons';

type TabType = 'devices' | 'usage' | 'preferences';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'devices' as const, label: 'Cihazlar', icon: Cpu },
  { id: 'usage' as const, label: 'Kullanım', icon: Settings2 },
  { id: 'preferences' as const, label: 'Tercihler', icon: SlidersHorizontal },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
      <nav className="flex gap-1" aria-label="Seçim adımları">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-md
                font-medium text-sm transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              aria-current={isActive ? 'step' : undefined}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
