import {
  Home,
  Building,
  Briefcase,
  Store,
  Heart,
  Factory,
  HardHat,
  Mountain,
  Wheat,
  Ship,
  Radio,
  Music,
  Globe,
  Check
} from 'lucide-react';
import type { UsageEnvironment } from '../types';

interface QuickSettingsProps {
  environments: UsageEnvironment[];
  selectedEnvironment: string | null;
  selectedOrigin: 'europe' | 'china' | 'any';
  onEnvironmentChange: (id: string) => void;
  onOriginChange: (origin: 'europe' | 'china' | 'any') => void;
}

const environmentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Building, Briefcase, Store, Heart, Factory, HardHat, Mountain, Wheat, Ship, Radio, Music,
};

export function QuickSettings({
  environments,
  selectedEnvironment,
  selectedOrigin,
  onEnvironmentChange,
  onOriginChange,
}: QuickSettingsProps) {
  return (
    <div className="p-4 border-t border-gray-100 space-y-4">
      {/* Environment Selection */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Kullanım Ortamı</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {environments.slice(0, 8).map((env) => {
            const Icon = environmentIcons[env.icon] || Factory;
            const isSelected = selectedEnvironment === env.id;

            return (
              <button
                key={env.id}
                onClick={() => onEnvironmentChange(env.id)}
                className={`
                  relative p-2 rounded-lg border text-center transition-all text-xs
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                  }
                `}
              >
                {isSelected && (
                  <Check className="absolute top-1 right-1 w-3 h-3 text-blue-500" />
                )}
                <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="block truncate">{env.name.split('/')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Origin Selection */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Menşei Tercihi</label>
        <div className="flex gap-2">
          {[
            { id: 'any' as const, label: 'Fark Etmez', desc: 'Tüm seçenekler' },
            { id: 'europe' as const, label: 'Avrupa', desc: 'Perkins, Deutz' },
            { id: 'china' as const, label: 'Çin', desc: 'Ricardo, Weichai' },
          ].map((option) => {
            const isSelected = selectedOrigin === option.id;

            return (
              <button
                key={option.id}
                onClick={() => onOriginChange(option.id)}
                className={`
                  flex-1 p-2 rounded-lg border text-center transition-all
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <Globe className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`block text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                <span className={`block text-[10px] ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                  {option.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
