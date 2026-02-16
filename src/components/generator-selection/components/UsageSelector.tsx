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
  Clock,
  DollarSign,
  Scale,
  Shield,
  Zap,
  Check
} from '../icons';
import type { UsageEnvironment, UsageDuration, Priority } from '../types';

interface UsageSelectorProps {
  environments: UsageEnvironment[];
  durations: UsageDuration[];
  priorities: Priority[];
  selectedEnvironment: string | null;
  selectedDuration: string | null;
  selectedPriority: string | null;
  onEnvironmentChange: (id: string) => void;
  onDurationChange: (id: string) => void;
  onPriorityChange: (id: string) => void;
}

const environmentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
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
};

const priorityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  Scale,
  Shield,
  Zap,
};

export function UsageSelector({
  environments,
  durations,
  priorities,
  selectedEnvironment,
  selectedDuration,
  selectedPriority,
  onEnvironmentChange,
  onDurationChange,
  onPriorityChange,
}: UsageSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Environment Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Kullanım Ortamı</h2>
          <p className="text-sm text-gray-500 mt-1">
            Jeneratörün kullanılacağı ortamı seçin
          </p>
        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {environments.map((env) => {
            const Icon = environmentIcons[env.icon] || Factory;
            const isSelected = selectedEnvironment === env.id;

            return (
              <button
                key={env.id}
                onClick={() => onEnvironmentChange(env.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full
                                  flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2
                  ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                  {env.name}
                </p>
                <p className={`text-xs mt-0.5 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                  {env.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Kullanım Süresi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Jeneratörü ne kadar süre kullanacaksınız?
          </p>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {durations.map((duration) => {
            const isSelected = selectedDuration === duration.id;

            return (
              <button
                key={duration.id}
                onClick={() => onDurationChange(duration.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full
                                  flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                  `}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {duration.name}
                    </p>
                    <p className={`text-sm mt-0.5 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                      {duration.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Önceliğiniz</h2>
          <p className="text-sm text-gray-500 mt-1">
            Jeneratör seçiminde nelere öncelik veriyorsunuz?
          </p>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          {priorities.map((priority) => {
            const Icon = priorityIcons[priority.icon] || Zap;
            const isSelected = selectedPriority === priority.id;

            return (
              <button
                key={priority.id}
                onClick={() => onPriorityChange(priority.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full
                                  flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2
                  ${isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-sm font-medium ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                  {priority.name}
                </p>
                <p className={`text-xs mt-0.5 ${isSelected ? 'text-green-700' : 'text-gray-500'}`}>
                  {priority.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
