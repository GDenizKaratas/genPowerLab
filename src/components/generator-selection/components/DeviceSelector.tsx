import { useState } from 'react';
import {
  Home,
  Store,
  Factory,
  HardHat,
  Wheat,
  Plus,
  Minus,
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
  PlusCircle
} from '../icons';
import type { Device, DeviceCategory, SelectedDevice } from '../types';
import { generateDeviceId, formatWatt } from '../utils/calculations';
import { CustomDeviceModal } from './CustomDeviceModal';

interface DeviceSelectorProps {
  categories: DeviceCategory[];
  onAddDevice: (device: SelectedDevice) => void;
}

// Category icons and colors
const categoryConfig: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string, bg: string }> = {
  home: { icon: Home, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100' },
  commercial: { icon: Store, color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100' },
  industrial: { icon: Factory, color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100' },
  construction: { icon: HardHat, color: 'text-yellow-600', bg: 'bg-yellow-50 hover:bg-yellow-100' },
  agriculture: { icon: Wheat, color: 'text-green-600', bg: 'bg-green-50 hover:bg-green-100' },
};

// Device-specific icons
const deviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Home
  'refrigerator': Refrigerator,
  'freezer': Snowflake,
  'ac-9000': Wind, 'ac-12000': Wind, 'ac-18000': Wind, 'ac-24000': Wind,
  'tv-led-32': Tv, 'tv-led-55': Tv,
  'washing-machine': WashingMachine,
  'dishwasher': Utensils,
  'microwave': Microwave,
  'electric-oven': Flame,
  'water-heater': Droplets,
  'vacuum-cleaner': Wind,
  'iron': Flame,
  'hair-dryer': Wind,
  'computer-desktop': Monitor,
  'laptop': Laptop,
  'led-lighting': Lightbulb,
  'water-pump-05hp': Droplets, 'water-pump-1hp': Droplets,
  // Commercial
  'commercial-refrigerator': Refrigerator,
  'display-cooler': Refrigerator,
  'ice-machine': Snowflake,
  'coffee-machine': Coffee,
  'pos-system': Monitor,
  'commercial-ac': Wind,
  'elevator-small': Box, 'elevator-medium': Box,
  // Industrial
  'motor-1hp': Cog, 'motor-2hp': Cog, 'motor-3hp': Cog, 'motor-5hp': Cog,
  'motor-7.5hp': Cog, 'motor-10hp': Cog, 'motor-15hp': Cog, 'motor-20hp': Cog,
  'motor-30hp': Cog, 'motor-50hp': Cog,
  'compressor-3hp': Fan, 'compressor-5hp': Fan, 'compressor-10hp': Fan,
  'welder-arc': Zap, 'welder-mig': Zap,
  'cnc-lathe': Wrench, 'cnc-milling': Wrench,
  'hydraulic-press': Hammer,
  'crane-5ton': Box, 'crane-10ton': Box,
  'conveyor-belt': Cog,
  'industrial-fan': Fan,
  'chiller': Snowflake,
  // Construction
  'concrete-mixer': Cog, 'concrete-vibrator': Cog,
  'angle-grinder': Wrench, 'circular-saw': Wrench,
  'hammer-drill': Hammer,
  'site-lighting': Lightbulb,
  'tower-crane': Box, 'construction-elevator': Box,
  // Agriculture
  'irrigation-pump-3hp': Droplets, 'irrigation-pump-5hp': Droplets, 'irrigation-pump-10hp': Droplets,
  'milking-machine': Milk, 'milk-cooler': Milk,
  'feed-mixer': Cog,
  'grain-dryer': Wind,
  'greenhouse-heating': Flame,
};

export function DeviceSelector({ categories, onAddDevice }: DeviceSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || 'home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Get active category data
  const activeCategoryData = categories.find(c => c.id === activeCategory);

  // Filter devices by search
  const filteredDevices = activeCategoryData?.devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleAddDevice = (device: Device, quantity: number = 1) => {
    const selectedDevice: SelectedDevice = {
      id: generateDeviceId(),
      deviceId: device.id,
      name: device.name,
      quantity,
      watt: device.defaultWatt,
      powerFactor: device.powerFactor,
      inrushMultiplier: device.inrushMultiplier,
      phase: device.phase,
      isCustom: false,
    };
    onAddDevice(selectedDevice);
  };

  const handleAddCustomDevice = (device: SelectedDevice) => {
    onAddDevice(device);
    setShowCustomModal(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Category Tabs - Horizontal scroll on mobile */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const config = categoryConfig[category.id] || categoryConfig.home;
            const CategoryIcon = config.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-all flex-shrink-0
                  ${isActive
                    ? `${config.color} border-current bg-white`
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
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

      {/* Search + Manual Add */}
      <div className="p-3 border-b border-gray-100 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cihaz ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium
                     rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Manuel Ekle</span>
        </button>
      </div>

      {/* Device Grid - Aksa Style */}
      <div className="p-3 max-h-[400px] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onAdd={handleAddDevice}
              categoryColor={categoryConfig[activeCategory]?.color || 'text-blue-600'}
            />
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Cihaz bulunamadı</p>
          </div>
        )}
      </div>

      {/* Custom Device Modal */}
      {showCustomModal && (
        <CustomDeviceModal
          onClose={() => setShowCustomModal(false)}
          onAdd={handleAddCustomDevice}
        />
      )}
    </div>
  );
}

// Device Card - Aksa Style with icon, quantity controls always visible
interface DeviceCardProps {
  device: Device;
  onAdd: (device: Device, quantity: number) => void;
  categoryColor: string;
}

function DeviceCard({ device, onAdd, categoryColor }: DeviceCardProps) {
  const [quantity, setQuantity] = useState(1);
  const DeviceIcon = deviceIconMap[device.id] || Zap;

  const handleAdd = () => {
    onAdd(device, quantity);
    setQuantity(1);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200">
      {/* Icon and Name */}
      <div className="flex flex-col items-center text-center mb-2">
        <div className={`w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 ${categoryColor}`}>
          <DeviceIcon className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-medium text-gray-900 leading-tight line-clamp-2 min-h-[2rem]">
          {device.name}
        </h4>
        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
          {formatWatt(device.defaultWatt)}
          {device.phase === 'three' && (
            <span className="px-1 bg-purple-100 text-purple-700 rounded text-[8px]">3F</span>
          )}
        </p>
      </div>

      {/* Quantity + Add */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center border border-gray-300 rounded bg-white">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-7 h-7 flex items-center justify-center text-xs font-semibold border-x border-gray-200">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 h-7 bg-blue-600 text-white text-xs font-medium rounded
                     hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Ekle
        </button>
      </div>
    </div>
  );
}
