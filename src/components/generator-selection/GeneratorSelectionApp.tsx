import { useState, useMemo, useCallback, useEffect } from 'react';
import { Settings2, Globe, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import type { SelectedDevice, UsageEnvironment, CalculationResult } from './types';
import { calculateKva } from './utils/calculations';

// Import data
import devicesData from '../../data/generator-selection/devices.json';
import environmentsData from '../../data/generator-selection/environments.json';

// Import components
import { DeviceSelector } from './components/DeviceSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { SelectedDevicesList } from './components/SelectedDevicesList';
import { HowItWorksModal } from './components/HowItWorksModal';
import { QuickSettings } from './components/QuickSettings';

export function GeneratorSelectionApp() {
  // State
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<'europe' | 'china' | 'any'>('any');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Show "How it works" modal on first visit
  useEffect(() => {
    const hasSeenModal = localStorage.getItem('genpower-howItWorks-seen');
    if (!hasSeenModal) {
      setShowHowItWorks(true);
    }
  }, []);

  const handleCloseHowItWorks = () => {
    setShowHowItWorks(false);
    localStorage.setItem('genpower-howItWorks-seen', 'true');
  };

  // Get environment object
  const environment = useMemo(() => {
    if (!selectedEnvironment) return null;
    return environmentsData.usageEnvironments.find(
      (e) => e.id === selectedEnvironment
    ) as UsageEnvironment | undefined ?? null;
  }, [selectedEnvironment]);

  // Calculate kVA
  const calculationResult: CalculationResult = useMemo(() => {
    return calculateKva(selectedDevices, environment);
  }, [selectedDevices, environment]);

  // Device handlers
  const handleAddDevice = useCallback((device: SelectedDevice) => {
    setSelectedDevices((prev) => [...prev, device]);
  }, []);

  const handleRemoveDevice = useCallback((id: string) => {
    setSelectedDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setSelectedDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, quantity } : d))
    );
  }, []);

  // Check if can show result
  const canShowResult = selectedDevices.length > 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* How It Works Modal */}
      {showHowItWorks && (
        <HowItWorksModal onClose={handleCloseHowItWorks} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left Column - Device Selection (3/5 width) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Help button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Nasıl Çalışır?
            </button>
          </div>

          {/* Device Selector */}
          <DeviceSelector
            categories={devicesData.categories}
            onAddDevice={handleAddDevice}
          />

          {/* Quick Settings - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Kullanım Ayarları</span>
                {(selectedEnvironment || selectedOrigin !== 'any') && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {[
                      selectedEnvironment && environmentsData.usageEnvironments.find(e => e.id === selectedEnvironment)?.name,
                      selectedOrigin !== 'any' && (selectedOrigin === 'europe' ? 'Avrupa' : 'Çin')
                    ].filter(Boolean).join(' • ')}
                  </span>
                )}
              </div>
              {showSettings ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showSettings && (
              <QuickSettings
                environments={environmentsData.usageEnvironments as UsageEnvironment[]}
                selectedEnvironment={selectedEnvironment}
                selectedOrigin={selectedOrigin}
                onEnvironmentChange={setSelectedEnvironment}
                onOriginChange={setSelectedOrigin}
              />
            )}
          </div>
        </div>

        {/* Right Column - Selected Devices & Result (2/5 width) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Selected Devices List */}
          <SelectedDevicesList
            devices={selectedDevices}
            onRemove={handleRemoveDevice}
            onUpdateQuantity={handleUpdateQuantity}
            totalWatt={calculationResult.totalWatt}
          />

          {/* Result Display */}
          {canShowResult && (
            <ResultDisplay
              result={calculationResult}
              environment={environment}
              origin={selectedOrigin}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneratorSelectionApp;
