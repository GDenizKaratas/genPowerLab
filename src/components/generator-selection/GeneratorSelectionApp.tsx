import { useState, useMemo, useCallback, useEffect } from "react";
import { Settings2, ChevronDown, ChevronUp, HelpCircle } from "./icons";
import type {
  SelectedDevice,
  UsageEnvironment,
  CalculationResult,
  UsageType,
  GeneratorGroup,
  StepLoadPercent,
} from "./types";
import { calculateKva } from "./utils/calculations";

// Import data
import devicesData from "../../data/generator-selection/devices.json";
import environmentsData from "../../data/generator-selection/environments.json";

// Import components
import { DeviceSelector } from "./components/DeviceSelector";
import { ResultDisplay } from "./components/ResultDisplay";
import { SelectedDevicesList } from "./components/SelectedDevicesList";
import { HowItWorksModal } from "./components/HowItWorksModal";
import { QuickSettings } from "./components/QuickSettings";

export function GeneratorSelectionApp() {
  // State
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
  const [selectedEnvironmentIds, setSelectedEnvironmentIds] = useState<
    string[]
  >([]);
  const [selectedEnvironmentOptions, setSelectedEnvironmentOptions] = useState<
    string[]
  >([]);
  const [selectedMotorOrigin, setSelectedMotorOrigin] = useState<
    "europe" | "china" | "any"
  >("any");
  const [selectedAlternatorOrigin, setSelectedAlternatorOrigin] = useState<
    "europe" | "china" | "any"
  >("any");
  const [usageType, setUsageType] = useState<UsageType>("standby");
  const [generatorGroup, setGeneratorGroup] = useState<GeneratorGroup>("any");
  const [stepLoadPercent, setStepLoadPercent] =
    useState<StepLoadPercent>("any");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Show "How it works" modal on first visit
  useEffect(() => {
    const hasSeenModal = localStorage.getItem("genpower-howItWorks-seen");
    if (!hasSeenModal) {
      setShowHowItWorks(true);
    }
  }, []);

  const handleCloseHowItWorks = () => {
    setShowHowItWorks(false);
    localStorage.setItem("genpower-howItWorks-seen", "true");
  };

  // Reset step load when generator group changes to 'any'
  useEffect(() => {
    if (generatorGroup === "any") {
      setStepLoadPercent("any");
    }
  }, [generatorGroup]);

  const allEnvironments = useMemo(
    () => environmentsData.usageEnvironments as UsageEnvironment[],
    [],
  );

  // Get selected environment objects
  const selectedEnvironments = useMemo(
    () =>
      allEnvironments.filter((environment) =>
        selectedEnvironmentIds.includes(environment.id),
      ),
    [allEnvironments, selectedEnvironmentIds],
  );

  const availableEnvironmentOptions = useMemo(
    () =>
      Array.from(
        new Set(
          selectedEnvironments.flatMap(
            (environment) => environment.recommendedFeatures,
          ),
        ),
      ),
    [selectedEnvironments],
  );

  // Clear option selections that are no longer relevant after environment changes
  useEffect(() => {
    setSelectedEnvironmentOptions((previous) =>
      previous.filter((option) => availableEnvironmentOptions.includes(option)),
    );
  }, [availableEnvironmentOptions]);

  // Calculate kVA
  const calculationResult: CalculationResult = useMemo(() => {
    return calculateKva(
      selectedDevices,
      selectedEnvironments,
      usageType,
      stepLoadPercent,
    );
  }, [selectedDevices, selectedEnvironments, usageType, stepLoadPercent]);

  // Device handlers
  const handleAddDevice = useCallback((device: SelectedDevice) => {
    setSelectedDevices((prev) => {
      const existing = prev.find(
        (d) => d.deviceId === device.deviceId && !d.isCustom,
      );
      if (existing) {
        return prev.map((d) =>
          d.id === existing.id
            ? { ...d, quantity: existing.quantity + device.quantity }
            : d,
        );
      }
      return [...prev, device];
    });
  }, []);

  const handleRemoveDevice = useCallback((id: string) => {
    setSelectedDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setSelectedDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, quantity } : d)),
    );
  }, []);

  const handleEnvironmentChange = useCallback((id: string) => {
    setSelectedEnvironmentIds((previous) =>
      previous.includes(id)
        ? previous.filter((environmentId) => environmentId !== id)
        : [...previous, id],
    );
  }, []);

  const handleEnvironmentOptionToggle = useCallback((optionId: string) => {
    setSelectedEnvironmentOptions((previous) =>
      previous.includes(optionId)
        ? previous.filter((selectedOption) => selectedOption !== optionId)
        : [...previous, optionId],
    );
  }, []);

  // Check if can show result
  const canShowResult = selectedDevices.length > 0;

  // Count active options for badge
  const activeOptionCount = [
    usageType !== "standby",
    generatorGroup !== "any",
    selectedEnvironmentIds.length > 0,
    selectedEnvironmentOptions.length > 0,
    selectedMotorOrigin !== "any",
    selectedAlternatorOrigin !== "any",
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* How It Works Modal */}
      {showHowItWorks && <HowItWorksModal onClose={handleCloseHowItWorks} />}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left Column - Device Selection (3/5 width) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Help button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="text-xs text-white hover:text-blue-100 flex items-center gap-1 bg-blue-700 px-2 py-1 rounded transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Nasıl Çalışır?
            </button>
          </div>

          {/* Device Selector */}
          <DeviceSelector
            categories={devicesData.categories}
            onAddDevice={handleAddDevice}
            hasSelectedDevices={selectedDevices.length > 0}
          />
        </div>

        {/* Right Column - Selected Devices, Options & Result (2/5 width) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Selected Devices List */}
          <SelectedDevicesList
            devices={selectedDevices}
            onRemove={handleRemoveDevice}
            onUpdateQuantity={handleUpdateQuantity}
            totalWatt={calculationResult.totalWatt}
          />

          {/* Opsiyon Paketi - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Opsiyonlar
                </span>
                <span className="text-[10px] text-gray-400">
                  (Detaylandırma)
                </span>
                {activeOptionCount > 0 && (
                  <span className="text-[10px] text-white bg-blue-500 px-1.5 py-0.5 rounded-full font-medium">
                    {activeOptionCount}
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
                environments={allEnvironments}
                selectedEnvironmentIds={selectedEnvironmentIds}
                selectedEnvironmentOptions={selectedEnvironmentOptions}
                selectedMotorOrigin={selectedMotorOrigin}
                selectedAlternatorOrigin={selectedAlternatorOrigin}
                usageType={usageType}
                generatorGroup={generatorGroup}
                stepLoadPercent={stepLoadPercent}
                onEnvironmentChange={handleEnvironmentChange}
                onEnvironmentOptionToggle={handleEnvironmentOptionToggle}
                onMotorOriginChange={setSelectedMotorOrigin}
                onAlternatorOriginChange={setSelectedAlternatorOrigin}
                onUsageTypeChange={setUsageType}
                onGeneratorGroupChange={setGeneratorGroup}
                onStepLoadPercentChange={setStepLoadPercent}
              />
            )}
          </div>

          {/* Result Display */}
          {canShowResult && (
            <ResultDisplay
              result={calculationResult}
              environments={selectedEnvironments}
              selectedEnvironmentOptions={selectedEnvironmentOptions}
              motorOrigin={selectedMotorOrigin}
              alternatorOrigin={selectedAlternatorOrigin}
              devices={selectedDevices}
              usageType={usageType}
              generatorGroup={generatorGroup}
              stepLoadPercent={stepLoadPercent}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneratorSelectionApp;
