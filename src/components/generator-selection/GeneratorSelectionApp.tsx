import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Settings2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle,
  Zap,
  Package,
  BarChart2,
} from "./icons";
import type {
  SelectedDevice,
  UsageEnvironment,
  CalculationResult,
  UsageType,
  GeneratorGroup,
  StepLoadPercent,
  CabinPreference,
  SwitchPreference,
  AtsPreference,
} from "./types";
import { calculateKva } from "./utils/calculations";

// Import data
import devicesData from "../../data/generator-selection/devices.json";
import environmentsData from "../../data/generator-selection/environments.json";
import type { DeviceCategory } from "./types";

const typedCategories = devicesData.categories as DeviceCategory[];

// Import components
import { DeviceSelector } from "./components/DeviceSelector";
import { ResultDisplay } from "./components/ResultDisplay";
import { SelectedDevicesList } from "./components/SelectedDevicesList";
import { HowItWorksModal } from "./components/HowItWorksModal";
import { QuickSettings } from "./components/QuickSettings";

type MobileTab = "devices" | "cart" | "result";

function getHasSeenHowItWorks() {
  try {
    return window.localStorage.getItem("genpower-howItWorks-seen") === "true";
  } catch {
    return true;
  }
}

function setHasSeenHowItWorks() {
  try {
    window.localStorage.setItem("genpower-howItWorks-seen", "true");
  } catch {
    // Ignore storage failures; the modal state is still closed in memory.
  }
}

export function GeneratorSelectionApp() {
  // State
  const appRef = useRef<HTMLDivElement>(null);
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
  const [selectedEnvironmentIds, setSelectedEnvironmentIds] = useState<string[]>([]);
  const [selectedEnvironmentOptions, setSelectedEnvironmentOptions] = useState<string[]>([]);
  const [selectedMotorOrigin, setSelectedMotorOrigin] = useState<"europe" | "china" | "any">("any");
  const [selectedAlternatorOrigin, setSelectedAlternatorOrigin] = useState<"europe" | "china" | "any">("any");
  const [cabinPreference, setCabinPreference] = useState<CabinPreference>("without-cabin");
  const [switchPreference, setSwitchPreference] = useState<SwitchPreference>("yok");
  const [atsPreference, setAtsPreference] = useState<AtsPreference>("yok");
  const [usageType, setUsageType] = useState<UsageType>("standby");
  const [generatorGroup, setGeneratorGroup] = useState<GeneratorGroup>("any");
  const [stepLoadPercent, setStepLoadPercent] = useState<StepLoadPercent>("any");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("devices");

  useEffect(() => {
    if (!getHasSeenHowItWorks()) setShowHowItWorks(true);
  }, []);

  const handleCloseHowItWorks = () => {
    setShowHowItWorks(false);
    setHasSeenHowItWorks();
  };

  useEffect(() => {
    if (generatorGroup === "any") setStepLoadPercent("any");
  }, [generatorGroup]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const allEnvironments = useMemo(
    () => environmentsData.usageEnvironments as UsageEnvironment[],
    [],
  );

  const selectedEnvironments = useMemo(
    () => allEnvironments.filter((e) => selectedEnvironmentIds.includes(e.id)),
    [allEnvironments, selectedEnvironmentIds],
  );

  const availableEnvironmentOptions = useMemo(
    () => Array.from(new Set(selectedEnvironments.flatMap((e) => e.recommendedFeatures))),
    [selectedEnvironments],
  );

  useEffect(() => {
    setSelectedEnvironmentOptions((prev) =>
      prev.filter((opt) => availableEnvironmentOptions.includes(opt)),
    );
  }, [availableEnvironmentOptions]);

  const calculationResult: CalculationResult = useMemo(
    () => calculateKva(selectedDevices, selectedEnvironments, usageType, stepLoadPercent),
    [selectedDevices, selectedEnvironments, usageType, stepLoadPercent],
  );

  const selectedItemCount = useMemo(
    () => selectedDevices.reduce((total, device) => total + device.quantity, 0),
    [selectedDevices],
  );

  const scrollMobileAppToTop = useCallback(() => {
    window.requestAnimationFrame(() => {
      const appTop = appRef.current?.getBoundingClientRect().top ?? 0;
      const headerOffset = 82;
      window.scrollTo({
        top: Math.max(0, window.scrollY + appTop - headerOffset),
        behavior: "smooth",
      });
    });
  }, []);

  const handleMobileTabChange = useCallback(
    (tab: MobileTab) => {
      setMobileTab(tab);
      scrollMobileAppToTop();
    },
    [scrollMobileAppToTop],
  );

  const handleAddDevice = useCallback((device: SelectedDevice) => {
    const existing = selectedDevices.find((d) => d.deviceId === device.deviceId && !d.isCustom);
    setSelectedDevices((prev) => {
      if (existing) {
        return prev.map((d) =>
          d.id === existing.id ? { ...d, quantity: existing.quantity + device.quantity } : d,
        );
      }
      return [...prev, device];
    });
    setShowSettings(true);
    setToastMessage(existing ? `${device.name} adedi artırıldı` : `${device.name} eklendi`);
  }, [selectedDevices]);

  const handleRemoveDevice = useCallback((id: string) => {
    setSelectedDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setSelectedDevices((prev) => prev.map((d) => (d.id === id ? { ...d, quantity } : d)));
  }, []);

  const handleEnvironmentChange = useCallback((id: string) => {
    setSelectedEnvironmentIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id],
    );
  }, []);

  const handleEnvironmentOptionToggle = useCallback((optionId: string) => {
    setSelectedEnvironmentOptions((prev) =>
      prev.includes(optionId) ? prev.filter((o) => o !== optionId) : [...prev, optionId],
    );
  }, []);

  const canShowResult = selectedDevices.length > 0;

  const activeOptionCount = [
    usageType !== "standby",
    generatorGroup !== "any",
    selectedEnvironmentIds.length > 0,
    selectedEnvironmentOptions.length > 0,
    selectedMotorOrigin !== "any",
    selectedAlternatorOrigin !== "any",
    cabinPreference !== "without-cabin",
    switchPreference !== "yok",
    atsPreference !== "yok",
  ].filter(Boolean).length;

  // Shared right-column content
  const rightColumnContent = (
    <div className="space-y-3">
      <SelectedDevicesList
        devices={selectedDevices}
        onRemove={handleRemoveDevice}
        onUpdateQuantity={handleUpdateQuantity}
        totalWatt={calculationResult.totalWatt}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Opsiyonlar</span>
            <span className="text-[10px] text-gray-400">(Detaylandırma)</span>
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
            cabinPreference={cabinPreference}
            switchPreference={switchPreference}
            atsPreference={atsPreference}
            usageType={usageType}
            generatorGroup={generatorGroup}
            stepLoadPercent={stepLoadPercent}
            onEnvironmentChange={handleEnvironmentChange}
            onEnvironmentOptionToggle={handleEnvironmentOptionToggle}
            onMotorOriginChange={setSelectedMotorOrigin}
            onAlternatorOriginChange={setSelectedAlternatorOrigin}
            onCabinPreferenceChange={setCabinPreference}
            onSwitchPreferenceChange={setSwitchPreference}
            onAtsPreferenceChange={setAtsPreference}
            onUsageTypeChange={setUsageType}
            onGeneratorGroupChange={setGeneratorGroup}
            onStepLoadPercentChange={setStepLoadPercent}
          />
        )}
      </div>

      {canShowResult && (
        <ResultDisplay
          result={calculationResult}
          environments={selectedEnvironments}
          selectedEnvironmentOptions={selectedEnvironmentOptions}
          motorOrigin={selectedMotorOrigin}
          alternatorOrigin={selectedAlternatorOrigin}
          cabinPreference={cabinPreference}
          switchPreference={switchPreference}
          atsPreference={atsPreference}
          devices={selectedDevices}
          usageType={usageType}
          generatorGroup={generatorGroup}
          stepLoadPercent={stepLoadPercent}
        />
      )}
    </div>
  );

  return (
    <div ref={appRef} className="generator-selection-app max-w-7xl mx-auto w-full min-w-0">
      {showHowItWorks && <HowItWorksModal onClose={handleCloseHowItWorks} />}

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="text-xs text-white hover:text-blue-100 flex items-center gap-1 bg-blue-700 px-2 py-1 rounded transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Nasıl Çalışır?
            </button>
          </div>
          <DeviceSelector
            categories={typedCategories}
            onAddDevice={handleAddDevice}
            hasSelectedDevices={selectedDevices.length > 0}
          />
        </div>
        <div className="lg:col-span-2">{rightColumnContent}</div>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden -mx-2 sm:mx-0">
        {/* Mobile header bar */}
        <div className="flex items-center justify-between gap-2 mb-2 px-2 sm:px-0">
          <p className="text-xs text-gray-500 truncate mb-0">
            {selectedDevices.length > 0
              ? `${selectedDevices.length} cihaz seçildi`
              : "Cihaz seçerek başlayın"}
          </p>
          <button
            onClick={() => setShowHowItWorks(true)}
            className="text-xs text-blue-700 hover:text-blue-800 flex flex-shrink-0 items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Nasıl Çalışır?
          </button>
        </div>

        {/* Tab content */}
        <div className="pb-[calc(6rem+env(safe-area-inset-bottom))]">
          {mobileTab === "devices" && (
            <DeviceSelector
              categories={typedCategories}
              onAddDevice={(device) => {
                handleAddDevice(device);
              }}
              hasSelectedDevices={selectedDevices.length > 0}
            />
          )}

          {mobileTab === "cart" && (
            <div className="space-y-3">
              <SelectedDevicesList
                devices={selectedDevices}
                onRemove={handleRemoveDevice}
                onUpdateQuantity={handleUpdateQuantity}
                totalWatt={calculationResult.totalWatt}
              />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full px-4 py-3 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Settings2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Opsiyonlar</span>
                    {activeOptionCount > 0 && (
                      <span className="text-[10px] text-white bg-blue-500 px-1.5 py-0.5 rounded-full font-medium">
                        {activeOptionCount}
                      </span>
                    )}
                  </div>
                  {showSettings ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {showSettings && (
                  <QuickSettings
                    environments={allEnvironments}
                    selectedEnvironmentIds={selectedEnvironmentIds}
                    selectedEnvironmentOptions={selectedEnvironmentOptions}
                    selectedMotorOrigin={selectedMotorOrigin}
                    selectedAlternatorOrigin={selectedAlternatorOrigin}
                    cabinPreference={cabinPreference}
                    switchPreference={switchPreference}
                    atsPreference={atsPreference}
                    usageType={usageType}
                    generatorGroup={generatorGroup}
                    stepLoadPercent={stepLoadPercent}
                    onEnvironmentChange={handleEnvironmentChange}
                    onEnvironmentOptionToggle={handleEnvironmentOptionToggle}
                    onMotorOriginChange={setSelectedMotorOrigin}
                    onAlternatorOriginChange={setSelectedAlternatorOrigin}
                    onCabinPreferenceChange={setCabinPreference}
                    onSwitchPreferenceChange={setSwitchPreference}
                    onAtsPreferenceChange={setAtsPreference}
                    onUsageTypeChange={setUsageType}
                    onGeneratorGroupChange={setGeneratorGroup}
                    onStepLoadPercentChange={setStepLoadPercent}
                  />
                )}
              </div>
            </div>
          )}

          {mobileTab === "result" && (
            <div>
              {canShowResult ? (
                <ResultDisplay
                  result={calculationResult}
                  environments={selectedEnvironments}
                  selectedEnvironmentOptions={selectedEnvironmentOptions}
                  motorOrigin={selectedMotorOrigin}
                  alternatorOrigin={selectedAlternatorOrigin}
                  cabinPreference={cabinPreference}
                  switchPreference={switchPreference}
                  atsPreference={atsPreference}
                  devices={selectedDevices}
                  usageType={usageType}
                  generatorGroup={generatorGroup}
                  stepLoadPercent={stepLoadPercent}
                />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <BarChart2 className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Henüz sonuç yok</p>
                  <p className="text-xs text-gray-400">
                    Cihaz sekmesinden en az bir cihaz ekleyin
                  </p>
                  <button
                    onClick={() => handleMobileTabChange("devices")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg"
                  >
                    Cihaz Seçmeye Git
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sticky Bottom Tab Bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-[45] border-t border-gray-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-3 px-2 pt-2 pb-2">
            <button
              type="button"
              onPointerUp={() => handleMobileTabChange("devices")}
              onClick={() => handleMobileTabChange("devices")}
              aria-current={mobileTab === "devices" ? "page" : undefined}
              className={`relative flex min-h-[3.35rem] flex-col items-center justify-center gap-0.5 rounded-xl transition-all active:scale-[0.98] ${
                mobileTab === "devices"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <div className="relative">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">Cihazlar</span>
            </button>

            <button
              type="button"
              onPointerUp={() => handleMobileTabChange("cart")}
              onClick={() => handleMobileTabChange("cart")}
              aria-current={mobileTab === "cart" ? "page" : undefined}
              className={`relative flex min-h-[3.35rem] flex-col items-center justify-center gap-0.5 rounded-xl transition-all active:scale-[0.98] ${
                mobileTab === "cart"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <div className="relative">
                <Package className="w-5 h-5" />
                {selectedItemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                    {selectedItemCount}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-[10px] font-medium">
                Seçilenler
                {selectedItemCount > 0 && (
                  <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold leading-none text-red-700">
                    {selectedItemCount}
                  </span>
                )}
              </span>
            </button>

            <button
              type="button"
              onPointerUp={() => handleMobileTabChange("result")}
              onClick={() => handleMobileTabChange("result")}
              aria-current={mobileTab === "result" ? "page" : undefined}
              className={`relative flex min-h-[3.35rem] flex-col items-center justify-center gap-0.5 rounded-xl transition-all active:scale-[0.98] ${
                mobileTab === "result"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <div className="relative">
                <BarChart2 className="w-5 h-5" />
                {canShowResult && (
                  <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                )}
              </div>
              <span className="text-[10px] font-medium">Sonuç</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed right-4 bottom-20 lg:bottom-4 z-50">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratorSelectionApp;
