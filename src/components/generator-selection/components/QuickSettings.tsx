import {
  Home,
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
  Check,
  Zap,
  Clock,
  Shield,
} from "../icons";
import type {
  UsageEnvironment,
  UsageType,
  GeneratorGroup,
  StepLoadPercent,
} from "../types";
import { InfoTooltip } from "./InfoTooltip";

interface QuickSettingsProps {
  environments: UsageEnvironment[];
  selectedEnvironmentIds: string[];
  selectedEnvironmentOptions: string[];
  selectedMotorOrigin: "europe" | "china" | "any";
  selectedAlternatorOrigin: "europe" | "china" | "any";
  usageType: UsageType;
  generatorGroup: GeneratorGroup;
  stepLoadPercent: StepLoadPercent;
  onEnvironmentChange: (id: string) => void;
  onEnvironmentOptionToggle: (optionId: string) => void;
  onMotorOriginChange: (origin: "europe" | "china" | "any") => void;
  onAlternatorOriginChange: (origin: "europe" | "china" | "any") => void;
  onUsageTypeChange: (type: UsageType) => void;
  onGeneratorGroupChange: (group: GeneratorGroup) => void;
  onStepLoadPercentChange: (percent: StepLoadPercent) => void;
}

const environmentIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Home,
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

const usageTypeOptions: {
  id: UsageType;
  label: string;
  desc: string;
  tooltip: string;
}[] = [
  {
    id: "standby",
    label: "Standby",
    desc: "Yedek güç",
    tooltip:
      "Sadece şebeke kesintilerinde devreye girer. Yıllık çalışma süresi düşüktür. En ekonomik seçenektir.",
  },
  {
    id: "prime",
    label: "Prime",
    desc: "Ana güç",
    tooltip:
      "Düzenli olarak ana güç kaynağı olarak kullanılır. Değişken yük altında sürekli çalışabilir. Şebeke olmayan veya yetersiz olduğu alanlarda tercih edilir.",
  },
  {
    id: "continuous",
    label: "Continuous",
    desc: "7/24 kesintisiz",
    tooltip:
      "Sabit yük altında 7/24 kesintisiz çalışma için tasarlanmıştır. En yüksek dayanıklılık ve kapasite gerektirir.",
  },
];

const generatorGroupOptions: {
  id: GeneratorGroup;
  label: string;
  tooltip: string;
}[] = [
  {
    id: "any",
    label: "Farketmez",
    tooltip: "Jeneratör grubu belirtilmez, genel hesaplama yapılır.",
  },
  {
    id: "G1",
    label: "G1",
    tooltip:
      "Küçük güç grubu (< 50 kVA). Konut, küçük işletme ve ofis kullanımına uygundur.",
  },
  {
    id: "G2",
    label: "G2",
    tooltip:
      "Orta güç grubu (50-250 kVA). Orta ölçekli işletme, AVM ve hastane gibi tesisler için uygundur.",
  },
  {
    id: "G3",
    label: "G3",
    tooltip:
      "Büyük güç grubu (> 250 kVA). Fabrika, maden ve büyük endüstriyel tesisler için uygundur.",
  },
];

const stepLoadOptions: { id: StepLoadPercent; label: string }[] = [
  { id: "any", label: "Farketmez" },
  { id: "0-25", label: "%0-25" },
  { id: "0-50", label: "%0-50" },
  { id: "0-75", label: "%0-75" },
  { id: "0-100", label: "%0-100" },
];

const environmentOptionLabels: Record<string, string> = {
  "low-noise": "Ses yalıtımı",
  compact: "Kompakt yapı",
  "auto-start": "Otomatik başlatma",
  "remote-monitoring": "Uzaktan izleme",
  redundant: "Redundant sistem",
  "ups-compatible": "UPS uyumu",
  "heavy-duty": "Ağır hizmet",
  "dust-proof": "Toz koruması",
  mobile: "Mobil kullanım",
  "explosion-proof": "Patlama koruması",
  "weather-proof": "Hava koşulu koruması",
  "easy-maintenance": "Kolay bakım",
  "corrosion-resistant": "Korozyon direnci",
  "marine-grade": "Deniz tipi ekipman",
  "quick-connect": "Hızlı bağlantı",
};

function getOptionLabel(optionId: string): string {
  return (
    environmentOptionLabels[optionId] ??
    optionId
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function QuickSettings({
  environments,
  selectedEnvironmentIds,
  selectedEnvironmentOptions,
  selectedMotorOrigin,
  selectedAlternatorOrigin,
  usageType,
  generatorGroup,
  stepLoadPercent,
  onEnvironmentChange,
  onEnvironmentOptionToggle,
  onMotorOriginChange,
  onAlternatorOriginChange,
  onUsageTypeChange,
  onGeneratorGroupChange,
  onStepLoadPercentChange,
}: QuickSettingsProps) {
  return (
    <div className="p-4 border-t border-gray-100 space-y-4">
      {/* Usage Type Selection */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3.5 h-3.5 text-gray-500" />
          <label className="text-xs font-medium text-gray-600">
            Kullanım Tipi
          </label>
          <InfoTooltip
            title="Kullanım Tipi"
            content="Jeneratörün ne sıklıkla ve hangi amaçla kullanılacağını belirler. Standby en ekonomik, Continuous en dayanıklı seçenektir."
            openMode="modal"
            fullscreenModal
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {usageTypeOptions.map((option) => {
            const isSelected = usageType === option.id;
            return (
              <div key={option.id} className="space-y-1">
                <button
                  onClick={() => onUsageTypeChange(option.id)}
                  className={`
                    relative w-full p-2 rounded-lg border text-center transition-all
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {isSelected && (
                    <Check className="absolute top-1 right-1 w-3 h-3 text-blue-500" />
                  )}
                  <span
                    className={`block text-xs font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}
                  >
                    {option.label}
                  </span>
                  <span
                    className={`block text-[10px] mt-0.5 ${isSelected ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {option.desc}
                  </span>
                </button>
                <div className="flex justify-center">
                  <InfoTooltip
                    title={option.label}
                    content={option.tooltip}
                    openMode="modal"
                    fullscreenModal
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generator Group Selection */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Shield className="w-3.5 h-3.5 text-gray-500" />
          <label className="text-xs font-medium text-gray-600">
            Jeneratör Grubu
          </label>
          <InfoTooltip
            title="Jeneratör Grubu"
            content="Güç kapasitesine göre sınıflandırma. G1: < 50 kVA, G2: 50-250 kVA, G3: > 250 kVA. Grup seçimi ilk adım yükü hesabını etkiler."
            openMode="modal"
            fullscreenModal
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {generatorGroupOptions.map((option) => {
            const isSelected = generatorGroup === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onGeneratorGroupChange(option.id)}
                className={`
                  p-2 rounded-lg border text-center transition-all text-xs font-medium
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Step Load Percent - appears when a generator group (not 'any') is selected */}
        {generatorGroup !== "any" && (
          <div className="mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <label className="text-xs font-medium text-gray-600">
                İlk Adım Yükü
              </label>
              <InfoTooltip
                title="İlk Adım Yükü"
                content="Jeneratör ilk çalıştığında anında devreye girecek yük yüzdesi. Yüksek ilk adım yükü daha büyük jeneratör kapasitesi gerektirir. Düşük yüzde seçmek kademeli yük devreye alma anlamına gelir."
                openMode="modal"
                fullscreenModal
              />
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {stepLoadOptions.map((option) => {
                const isSelected = stepLoadPercent === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => onStepLoadPercentChange(option.id)}
                    className={`
                      p-1.5 rounded-lg border text-center transition-all text-[11px] font-medium
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Environment Selection */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Home className="w-3.5 h-3.5 text-gray-500" />
          <label className="text-xs font-medium text-gray-600">
            Kullanım Ortamı
          </label>
          <InfoTooltip
            title="Kullanım Ortamı"
            content="Jeneratörün kurulacağı ortam tipi. Ortam seçimi talep faktörü ve güvenlik marjını etkiler. Zorlu ortamlar daha yüksek koruma seviyesi gerektirir."
            openMode="modal"
            fullscreenModal
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {environments.map((env) => {
            const Icon = environmentIcons[env.icon] || Factory;
            const isSelected = selectedEnvironmentIds.includes(env.id);

            return (
              <button
                key={env.id}
                onClick={() => onEnvironmentChange(env.id)}
                className={`
                  relative p-2 rounded-lg border text-center transition-all text-xs
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                  }
                `}
              >
                {isSelected && (
                  <Check className="absolute top-1 right-1 w-3 h-3 text-blue-500" />
                )}
                <Icon
                  className={`w-5 h-5 mx-auto mb-1 ${isSelected ? "text-blue-600" : "text-gray-400"}`}
                />
                <span className="block truncate">
                  {env.name.split("/")[0].trim()}
                </span>
              </button>
            );
          })}
        </div>

        {selectedEnvironmentIds.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-[11px] font-medium text-gray-600">
              Ortama Özel Opsiyonlar
            </p>
            {environments
              .filter((env) => selectedEnvironmentIds.includes(env.id))
              .map((env) => (
                <div
                  key={env.id}
                  className="p-2 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <p className="text-[11px] font-semibold text-gray-700 mb-1.5">
                    {env.name}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {env.recommendedFeatures.map((optionId) => {
                      const isChecked =
                        selectedEnvironmentOptions.includes(optionId);
                      return (
                        <label
                          key={`${env.id}-${optionId}`}
                          className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onEnvironmentOptionToggle(optionId)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{getOptionLabel(optionId)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Origin Selection */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          <label className="text-xs font-medium text-gray-600">
            Menşei Tercihleri
          </label>
          <InfoTooltip
            title="Menşei Tercihleri"
            content="Motor ve alternatör menşei tercihini belirler. Avrupa menşeli motorlar daha yüksek kalite ve uzun ömür sunar. Çin menşeli motorlar ekonomik fiyat avantajı sağlar."
            openMode="modal"
            fullscreenModal
          />
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-[11px] text-gray-600 mb-1">Motor Menşei</p>
            <div className="flex gap-2">
              {[
                {
                  id: "any" as const,
                  label: "Fark Etmez",
                  desc: "Tüm seçenekler",
                },
                {
                  id: "europe" as const,
                  label: "Avrupa",
                  // desc: "Perkins, Deutz",
                },
                {
                  id: "china" as const,
                  label: "Çin",
                  // desc: "Ricardo, Weichai",
                },
              ].map((option) => {
                const isSelected = selectedMotorOrigin === option.id;

                return (
                  <button
                    key={`motor-${option.id}`}
                    onClick={() => onMotorOriginChange(option.id)}
                    className={`
                      flex-1 p-2 rounded-lg border text-center transition-all
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className={`block text-xs font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`block text-[10px] ${isSelected ? "text-blue-600" : "text-gray-500"}`}
                    >
                      {option.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-gray-600 mb-1">Alternatör Menşei</p>
            <div className="flex gap-2">
              {[
                {
                  id: "any" as const,
                  label: "Fark Etmez",
                  desc: "Tüm seçenekler",
                },
                {
                  id: "europe" as const,
                  label: "Avrupa",
                  // desc: "Leroy Somer, Mecc Alte",
                },
                {
                  id: "china" as const,
                  label: "Çin",
                  // desc: "Stamford muadili",
                },
              ].map((option) => {
                const isSelected = selectedAlternatorOrigin === option.id;

                return (
                  <button
                    key={`alternator-${option.id}`}
                    onClick={() => onAlternatorOriginChange(option.id)}
                    className={`
                      flex-1 p-2 rounded-lg border text-center transition-all
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className={`block text-xs font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`block text-[10px] ${isSelected ? "text-blue-600" : "text-gray-500"}`}
                    >
                      {option.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
