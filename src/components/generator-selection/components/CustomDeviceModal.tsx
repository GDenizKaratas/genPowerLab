import { useState } from 'react';
import { X, Zap, Info } from 'lucide-react';
import type { SelectedDevice } from '../types';
import { generateDeviceId, wattToKva } from '../utils/calculations';

interface CustomDeviceModalProps {
  onClose: () => void;
  onAdd: (device: SelectedDevice) => void;
}

type InputMode = 'watt' | 'ampere';

export function CustomDeviceModal({ onClose, onAdd }: CustomDeviceModalProps) {
  const [inputMode, setInputMode] = useState<InputMode>('watt');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Watt mode
  const [watt, setWatt] = useState<number | ''>('');
  const [powerFactor, setPowerFactor] = useState(0.85);

  // Ampere mode
  const [voltage, setVoltage] = useState(220);
  const [ampere, setAmpere] = useState<number | ''>('');
  const [phase, setPhase] = useState<'single' | 'three'>('single');

  // Common
  const [inrushMultiplier, setInrushMultiplier] = useState(1);
  const [isMotor, setIsMotor] = useState(false);

  // Calculate watt from ampere inputs
  const calculatedWatt = inputMode === 'ampere' && ampere
    ? phase === 'three'
      ? voltage * Number(ampere) * Math.sqrt(3) * powerFactor
      : voltage * Number(ampere) * powerFactor
    : Number(watt) || 0;

  const calculatedKva = calculatedWatt > 0 ? wattToKva(calculatedWatt, powerFactor) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || calculatedWatt <= 0) return;

    const device: SelectedDevice = {
      id: generateDeviceId(),
      deviceId: 'custom',
      name: name.trim(),
      quantity,
      watt: Math.round(calculatedWatt),
      powerFactor,
      inrushMultiplier: isMotor ? inrushMultiplier : 1,
      phase: inputMode === 'ampere' ? phase : 'single',
      isCustom: true,
      customVoltage: inputMode === 'ampere' ? voltage : undefined,
      customAmpere: inputMode === 'ampere' ? Number(ampere) : undefined,
    };

    onAdd(device);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Özel Cihaz Ekle</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Device Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cihaz / Ekipman Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Freze Makinesi"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Input Mode Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Güç Bilgisi Giriş Şekli
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode('watt')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all
                  ${inputMode === 'watt'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Watt / kW
              </button>
              <button
                type="button"
                onClick={() => setInputMode('ampere')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all
                  ${inputMode === 'ampere'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Voltaj / Amper
              </button>
            </div>
          </div>

          {/* Watt Input Mode */}
          {inputMode === 'watt' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Güç (Watt)
                </label>
                <input
                  type="number"
                  value={watt}
                  onChange={(e) => setWatt(e.target.value ? Number(e.target.value) : '')}
                  placeholder="3000"
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Güç Faktörü (cos φ)
                </label>
                <select
                  value={powerFactor}
                  onChange={(e) => setPowerFactor(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1.0 (Rezistif yük)</option>
                  <option value={0.95}>0.95 (LED, elektronik)</option>
                  <option value={0.9}>0.90 (Klima, pompalar)</option>
                  <option value={0.85}>0.85 (Genel endüstriyel)</option>
                  <option value={0.8}>0.80 (Motorlar)</option>
                  <option value={0.75}>0.75 (Kaynak makineleri)</option>
                  <option value={0.7}>0.70 (Düşük PF yükler)</option>
                </select>
              </div>
            </div>
          )}

          {/* Ampere Input Mode */}
          {inputMode === 'ampere' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Voltaj (V)
                  </label>
                  <select
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={220}>220V (Tek Faz)</option>
                    <option value={380}>380V (Üç Faz)</option>
                    <option value={400}>400V (Üç Faz)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Akım (Amper)
                  </label>
                  <input
                    type="number"
                    value={ampere}
                    onChange={(e) => setAmpere(e.target.value ? Number(e.target.value) : '')}
                    placeholder="10"
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Faz
                  </label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="single">Tek Faz</option>
                    <option value="three">Üç Faz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Güç Faktörü (cos φ)
                  </label>
                  <select
                    value={powerFactor}
                    onChange={(e) => setPowerFactor(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>1.0 (Rezistif)</option>
                    <option value={0.95}>0.95</option>
                    <option value={0.9}>0.90</option>
                    <option value={0.85}>0.85</option>
                    <option value={0.8}>0.80</option>
                    <option value={0.75}>0.75</option>
                    <option value={0.7}>0.70</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Motor Checkbox */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isMotor}
                onChange={(e) => {
                  setIsMotor(e.target.checked);
                  if (e.target.checked) setInrushMultiplier(4);
                  else setInrushMultiplier(1);
                }}
                className="mt-0.5 w-5 h-5 text-blue-600 rounded border-gray-300
                           focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-amber-900">Bu bir motorlu cihaz mı?</span>
                <p className="text-sm text-amber-700 mt-0.5">
                  Motorlar çalışırken yüksek başlangıç akımı çeker
                </p>
              </div>
            </label>

            {isMotor && (
              <div className="mt-3 ml-8">
                <label className="block text-sm font-medium text-amber-900 mb-1.5">
                  Başlangıç Akımı Çarpanı
                </label>
                <select
                  value={inrushMultiplier}
                  onChange={(e) => setInrushMultiplier(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-lg bg-white
                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value={3}>3x (Hafif yük başlangıcı)</option>
                  <option value={4}>4x (Normal başlangıç)</option>
                  <option value={5}>5x (DOL - Direkt başlangıç)</option>
                  <option value={6}>6x (Ağır yük başlangıcı)</option>
                </select>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Adet
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-200
                           rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-200
                           rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Calculated Preview */}
          {calculatedWatt > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-900 font-medium mb-2">
                <Zap className="w-4 h-4" />
                Hesaplanan Değerler
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Toplam Güç:</span>
                  <span className="ml-2 font-semibold text-blue-900">
                    {(calculatedWatt * quantity / 1000).toFixed(2)} kW
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Toplam kVA:</span>
                  <span className="ml-2 font-semibold text-blue-900">
                    {(calculatedKva * quantity).toFixed(2)} kVA
                  </span>
                </div>
                {isMotor && (
                  <div className="col-span-2">
                    <span className="text-blue-700">Başlangıç kVA:</span>
                    <span className="ml-2 font-semibold text-blue-900">
                      {(calculatedKva * inrushMultiplier).toFixed(2)} kVA
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Cihazınızın etiketindeki değerleri girin. Güç faktörünü bilmiyorsanız
              genel endüstriyel değer olan 0.85 kullanılabilir.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-lg
                         text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!name.trim() || calculatedWatt <= 0}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg
                         font-medium hover:bg-blue-700 transition-colors
                         disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
