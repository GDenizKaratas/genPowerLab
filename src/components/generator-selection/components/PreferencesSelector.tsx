import { Check, Globe, CheckCircle, CircleDot } from 'lucide-react';
import calculationConfig from '../../../data/generator-selection/calculation-config.json';

interface PreferencesSelectorProps {
  selectedOrigin: 'europe' | 'china' | 'any';
  onOriginChange: (origin: 'europe' | 'china' | 'any') => void;
}

const { originOptions } = calculationConfig;

export function PreferencesSelector({
  selectedOrigin,
  onOriginChange,
}: PreferencesSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Origin Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Menşei Tercihi</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Motor ve alternatör menşei tercihinizi belirleyin
          </p>
        </div>

        <div className="p-4 space-y-3">
          {originOptions.map((option) => {
            const isSelected = selectedOrigin === option.id;

            return (
              <button
                key={option.id}
                onClick={() => onOriginChange(option.id as 'europe' | 'china' | 'any')}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Radio indicator */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    ${isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {option.name}
                      </p>
                      {option.id === 'any' && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                          Önerilen
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                      {option.description}
                    </p>

                    {/* Advantages */}
                    {option.advantages.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {option.advantages.map((adv, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-500' : 'text-green-500'}`} />
                            <span className={isSelected ? 'text-blue-800' : 'text-gray-700'}>{adv}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Considerations */}
                    {option.considerations.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {option.considerations.map((con, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CircleDot className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-amber-500'}`} />
                            <span className={isSelected ? 'text-blue-700' : 'text-gray-600'}>{con}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">Menşei Hakkında</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p>
            <strong>Avrupa Menşei:</strong> Perkins, Deutz, Volvo Penta gibi markalar
            uzun ömür ve yüksek güvenilirlik sunar. Yedek parça ve servis ağı geniştir.
          </p>
          <p>
            <strong>Çin Menşei:</strong> Ricardo, Weichai, SDEC gibi markalar ekonomik
            fiyat avantajı sağlar. Günümüzde kalite standartları önemli ölçüde artmıştır.
          </p>
          <p>
            <strong>Fark Etmez:</strong> İhtiyacınıza ve bütçenize en uygun kombinasyonu
            sunabilmemiz için esneklik sağlar.
          </p>
        </div>
      </div>
    </div>
  );
}
