import {
  Zap,
  AlertTriangle,
  Phone,
  ArrowRight
} from '../icons';
import type { CalculationResult, UsageEnvironment } from '../types';
import { getKvaRangeLabel } from '../utils/calculations';

interface ResultDisplayProps {
  result: CalculationResult;
  environment: UsageEnvironment | null;
  origin: 'europe' | 'china' | 'any';
}

export function ResultDisplay({ result, environment, origin }: ResultDisplayProps) {
  const originLabels = {
    europe: 'Avrupa',
    china: 'Çin',
    any: 'Tümü',
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200">
      {/* Main Result - Compact */}
      <div className="p-4">
        {/* Recommended kVA */}
        <div className="text-center py-3 mb-3 bg-white rounded-lg border border-green-200">
          <p className="text-xs text-green-600 mb-0.5">Önerilen Kapasite</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-green-900">
              {result.recommendedKva}
            </span>
            <span className="text-lg text-green-700">kVA</span>
          </div>
          <p className="text-xs text-green-600 mt-0.5">
            {getKvaRangeLabel(result.recommendedKva)}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div className="p-2 bg-white/80 rounded-lg">
            <p className="text-[10px] text-gray-500 uppercase">Toplam</p>
            <p className="text-sm font-bold text-gray-900">{result.totalKva.toFixed(1)}</p>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <p className="text-[10px] text-gray-500 uppercase">Talep</p>
            <p className="text-sm font-bold text-gray-900">{(result.demandFactor * 100).toFixed(0)}%</p>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <p className="text-[10px] text-gray-500 uppercase">Menşei</p>
            <p className="text-sm font-bold text-gray-900">{originLabels[origin]}</p>
          </div>
        </div>

        {/* Warnings - Compact */}
        {result.hasThreePhase && (
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200 mb-3 text-xs">
            <AlertTriangle className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span className="text-purple-900 font-medium">3 Faz gerekli</span>
          </div>
        )}

        {result.largestMotorKva > 5 && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200 mb-3 text-xs">
            <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-amber-900">Büyük motor: {result.largestMotorKva.toFixed(1)} kVA başlangıç</span>
          </div>
        )}

        {/* CTA Button */}
        <a
          href="/iletisim"
          className="w-full flex items-center justify-center gap-2 py-3 px-4
                     bg-gradient-to-r from-green-600 to-emerald-600 text-white
                     rounded-lg font-semibold shadow-md
                     hover:from-green-700 hover:to-emerald-700 transition-all
                     hover:shadow-lg text-sm"
        >
          <Phone className="w-4 h-4" />
          Teklif Al
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
