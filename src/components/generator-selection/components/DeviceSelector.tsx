import { useMemo, useRef, useState } from "react";
import {
  Home,
  Store,
  Factory,
  HardHat,
  Wheat,
  Search,
  Lightbulb,
  Tv,
  Monitor,
  Laptop,
  Refrigerator,
  Snowflake,
  Wind,
  WashingMachine,
  Utensils,
  Microwave,
  Flame,
  Droplets,
  Zap,
  Cog,
  Wrench,
  Hammer,
  Fan,
  Box,
  Coffee,
  Milk,
  PlusCircle,
  Check,
} from "../icons";
import type { Device, DeviceCategory, SelectedDevice } from "../types";
import { generateDeviceId, formatWatt } from "../utils/calculations";
import { CustomDeviceModal } from "./CustomDeviceModal";
import deviceImagesData from "../../../data/generator-selection/device-images.json";

interface DeviceSelectorProps {
  categories: DeviceCategory[];
  onAddDevice: (device: SelectedDevice) => void;
  hasSelectedDevices: boolean;
}

interface DeviceListItem {
  device: Device;
  categoryId: string;
  categoryName: string;
}

const ALL_CATEGORY_ID = "all";

const categoryConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  all: {
    icon: Zap,
    color: "text-slate-700",
    bg: "bg-slate-50 hover:bg-slate-100",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
  },
  home: {
    icon: Home,
    color: "text-blue-600",
    bg: "bg-blue-50 hover:bg-blue-100",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  commercial: {
    icon: Store,
    color: "text-purple-600",
    bg: "bg-purple-50 hover:bg-purple-100",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
  },
  industrial: {
    icon: Factory,
    color: "text-orange-600",
    bg: "bg-orange-50 hover:bg-orange-100",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
  },
  construction: {
    icon: HardHat,
    color: "text-yellow-600",
    bg: "bg-yellow-50 hover:bg-yellow-100",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-700",
  },
  agriculture: {
    icon: Wheat,
    color: "text-green-600",
    bg: "bg-green-50 hover:bg-green-100",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
  },
};

const deviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  refrigerator: Refrigerator,
  freezer: Snowflake,
  "ac-9000": Wind,
  "ac-12000": Wind,
  "ac-18000": Wind,
  "ac-24000": Wind,
  "tv-led-32": Tv,
  "tv-led-55": Tv,
  "washing-machine": WashingMachine,
  dishwasher: Utensils,
  microwave: Microwave,
  "electric-oven": Flame,
  "water-heater": Droplets,
  "vacuum-cleaner": Wind,
  iron: Flame,
  "hair-dryer": Wind,
  "computer-desktop": Monitor,
  laptop: Laptop,
  "led-lighting": Lightbulb,
  "water-pump-05hp": Droplets,
  "water-pump-1hp": Droplets,
  "commercial-refrigerator": Refrigerator,
  "display-cooler": Refrigerator,
  "ice-machine": Snowflake,
  "coffee-machine": Coffee,
  "pos-system": Monitor,
  "commercial-ac": Wind,
  "elevator-small": Box,
  "elevator-medium": Box,
  "motor-1hp": Cog,
  "motor-2hp": Cog,
  "motor-3hp": Cog,
  "motor-5hp": Cog,
  "motor-7.5hp": Cog,
  "motor-10hp": Cog,
  "motor-15hp": Cog,
  "motor-20hp": Cog,
  "motor-30hp": Cog,
  "motor-50hp": Cog,
  "compressor-3hp": Fan,
  "compressor-5hp": Fan,
  "compressor-10hp": Fan,
  "welder-arc": Zap,
  "welder-mig": Zap,
  "cnc-lathe": Wrench,
  "cnc-milling": Wrench,
  "hydraulic-press": Hammer,
  "crane-5ton": Box,
  "crane-10ton": Box,
  "conveyor-belt": Cog,
  "industrial-fan": Fan,
  chiller: Snowflake,
  "concrete-mixer": Cog,
  "concrete-vibrator": Cog,
  "angle-grinder": Wrench,
  "circular-saw": Wrench,
  "hammer-drill": Hammer,
  "site-lighting": Lightbulb,
  "tower-crane": Box,
  "construction-elevator": Box,
  "irrigation-pump-3hp": Droplets,
  "irrigation-pump-5hp": Droplets,
  "irrigation-pump-10hp": Droplets,
  "milking-machine": Milk,
  "milk-cooler": Milk,
  "feed-mixer": Cog,
  "grain-dryer": Wind,
  "greenhouse-heating": Flame,
};

const deviceImageMap = deviceImagesData as Record<string, string>;

export function DeviceSelector({
  categories,
  onAddDevice,
  hasSelectedDevices,
}: DeviceSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY_ID);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastCategoryBeforeSearch, setLastCategoryBeforeSearch] =
    useState<string>(ALL_CATEGORY_ID);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [recentlyAddedDeviceId, setRecentlyAddedDeviceId] = useState<string | null>(null);
  const handledPointerDeviceIdRef = useRef<string | null>(null);

  const categoryTabs = useMemo(
    () => [{ id: ALL_CATEGORY_ID, name: "Tümü" }, ...categories],
    [categories],
  );

  const devicesForList = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const flatDevices: DeviceListItem[] = categories.flatMap((category) =>
      category.devices.map((device) => ({
        device,
        categoryId: category.id,
        categoryName: category.name,
      })),
    );

    const shouldSearchAll = normalizedQuery.length > 0;
    const categoryFiltered =
      shouldSearchAll || activeCategory === ALL_CATEGORY_ID
        ? flatDevices
        : flatDevices.filter((item) => item.categoryId === activeCategory);

    const searchFiltered = normalizedQuery
      ? categoryFiltered.filter((item) =>
          item.device.name.toLowerCase().includes(normalizedQuery),
        )
      : categoryFiltered;

    return searchFiltered.sort((a, b) =>
      a.device.name.localeCompare(b.device.name, "tr"),
    );
  }, [categories, activeCategory, searchQuery]);

  const handleAddDeviceDirect = (device: Device) => {
    const selectedDevice: SelectedDevice = {
      id: generateDeviceId(),
      deviceId: device.id,
      name: device.name,
      quantity: 1,
      watt: device.defaultWatt,
      powerFactor: device.powerFactor,
      inrushMultiplier: device.inrushMultiplier,
      phase: device.phase,
      isCustom: false,
    };

    onAddDevice(selectedDevice);
    setRecentlyAddedDeviceId(device.id);
    window.setTimeout(() => {
      setRecentlyAddedDeviceId((currentDeviceId) =>
        currentDeviceId === device.id ? null : currentDeviceId,
      );
    }, 1200);
  };

  const handleAddButtonPointerUp = (device: Device) => {
    handledPointerDeviceIdRef.current = device.id;
    handleAddDeviceDirect(device);
    window.setTimeout(() => {
      if (handledPointerDeviceIdRef.current === device.id) {
        handledPointerDeviceIdRef.current = null;
      }
    }, 0);
  };

  const handleAddButtonClick = (device: Device) => {
    if (handledPointerDeviceIdRef.current === device.id) return;
    handleAddDeviceDirect(device);
  };

  const handleAddCustomDevice = (device: SelectedDevice) => {
    onAddDevice(device);
    setShowCustomModal(false);
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col
        h-[calc(100dvh-185px)] min-h-[430px] lg:h-[680px] lg:max-h-[72vh]
      `}
    >
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto overscroll-x-contain scrollbar-hide">
          {categoryTabs.map((category) => {
            const config = categoryConfig[category.id] || categoryConfig.home;
            const CategoryIcon = config.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0
                  ${
                    isActive
                      ? `${config.color} border-current bg-white`
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-2.5 sm:p-3 border-b border-gray-100 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={
              activeCategory === ALL_CATEGORY_ID
                ? "Tüm cihazlarda ara..."
                : "Cihaz ara..."
            }
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              const hasQuery = value.trim().length > 0;
              const hadQuery = searchQuery.trim().length > 0;

              if (hasQuery && !hadQuery && activeCategory !== ALL_CATEGORY_ID) {
                setLastCategoryBeforeSearch(activeCategory);
                setActiveCategory(ALL_CATEGORY_ID);
              }

              if (!hasQuery && hadQuery) {
                setActiveCategory(lastCategoryBeforeSearch);
              }

              setSearchQuery(value);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Manuel Ekle</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {devicesForList.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {devicesForList.map((item) => {
              const DeviceIcon = deviceIconMap[item.device.id] || Zap;
              const imageUrl = deviceImageMap[item.device.id];
              const categoryStyle =
                categoryConfig[item.categoryId] || categoryConfig.home;

              return (
                <div
                  key={item.device.id}
                  className="px-2.5 sm:px-3 py-2.5 flex items-center gap-2.5 sm:gap-3 hover:bg-gray-50 transition-colors"
                >
                  {imageUrl ? (
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                      <span className="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-white/95 shadow-sm">
                        <DeviceIcon className={`w-3 h-3 ${categoryStyle.color}`} />
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg border border-white shadow-sm flex items-center justify-center ${categoryStyle.bg}`}
                    >
                      <DeviceIcon className={`w-5 h-5 ${categoryStyle.color}`} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate mb-0">
                        {item.device.name}
                      </p>
                      {item.device.phase === "three" && (
                        <span className="px-1 py-0.5 rounded bg-purple-100 text-purple-700 text-[9px] font-medium">
                          3F
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-gray-500 mb-0 flex-shrink-0">
                        {formatWatt(item.device.defaultWatt)}
                      </p>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-medium truncate ${categoryStyle.badgeBg} ${categoryStyle.badgeText}`}
                      >
                        {item.categoryName}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onPointerUp={() => handleAddButtonPointerUp(item.device)}
                    onClick={() => handleAddButtonClick(item.device)}
                    className={`h-8 min-w-[4.25rem] px-3 flex-shrink-0 rounded-md text-xs font-semibold transition-colors ${
                      recentlyAddedDeviceId === item.device.id
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {recentlyAddedDeviceId === item.device.id ? (
                      <span className="flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Eklendi
                      </span>
                    ) : (
                      "Ekle"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center px-6 py-10">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Cihaz bulunamadı
              </p>
              <p className="text-xs text-gray-500">
                Arama kelimesini değiştirin veya başka kategori seçin.
              </p>
            </div>
          </div>
        )}
      </div>

      {showCustomModal && (
        <CustomDeviceModal
          onClose={() => setShowCustomModal(false)}
          onAdd={handleAddCustomDevice}
        />
      )}
    </div>
  );
}
