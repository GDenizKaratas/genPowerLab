import { Trash2, Zap, Package } from '../icons';
import type { SelectedDevice } from '../types';
import { formatWatt } from '../utils/calculations';

interface SelectedDevicesListProps {
  devices: SelectedDevice[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  totalWatt: number;
}

export function SelectedDevicesList({
  devices,
  onRemove,
  onUpdateQuantity,
  totalWatt,
}: SelectedDevicesListProps) {
  if (devices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="text-center py-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <Package className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1 text-sm">Henüz cihaz eklenmedi</h3>
          <p className="text-gray-500 text-xs">
            Listeden cihaz seçin veya manuel ekleyin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Seçilen Cihazlar</h3>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
            {devices.length}
          </span>
        </div>
      </div>

      {/* Device List - Fixed max height with scroll */}
      <div className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto">
        {devices.map((device) => (
          <div
            key={device.id}
            className="px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            {/* Device Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {device.name}
                </p>
                {device.isCustom && (
                  <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-medium">
                    M
                  </span>
                )}
                {device.phase === 'three' && (
                  <span className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-medium">
                    3F
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {formatWatt(device.watt * device.quantity)}
              </p>
            </div>

            {/* Quantity Controls - Compact */}
            <div className="flex items-center gap-0.5 border border-gray-200 rounded bg-white">
              <button
                onClick={() => onUpdateQuantity(device.id, Math.max(1, device.quantity - 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700
                           hover:bg-gray-100 rounded-l text-sm"
                aria-label="Azalt"
              >
                -
              </button>
              <span className="w-6 h-6 flex items-center justify-center text-xs font-semibold">
                {device.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(device.id, Math.min(10, device.quantity + 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700
                           hover:bg-gray-100 rounded-r text-sm"
                aria-label="Artır"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(device.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50
                         rounded transition-colors"
              aria-label={`${device.name} kaldır`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Total - Sticky at bottom */}
      <div className="px-4 py-3 bg-blue-50 border-t border-blue-100 rounded-b-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">Toplam Güç</span>
          <span className="text-lg font-bold text-blue-900">
            {formatWatt(totalWatt)}
          </span>
        </div>
      </div>
    </div>
  );
}
