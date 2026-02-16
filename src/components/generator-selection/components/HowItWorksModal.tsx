import { X, Cpu, Settings2, Calculator } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export function HowItWorksModal({ onClose }: HowItWorksModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Nasıl Çalışır?</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            3 basit adımda jeneratör ihtiyacınızı hesaplayın
          </p>
        </div>

        {/* Steps */}
        <div className="p-5 space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">1</span>
                <h3 className="font-semibold text-gray-900">Cihazları Ekleyin</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Listeden cihaz seçin veya "Manuel Ekle" ile özel ekipman girin. Adet belirleyin.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Settings2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center">2</span>
                <h3 className="font-semibold text-gray-900">Kullanımı Belirleyin</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Kullanım ortamını (ev, fabrika, şantiye...) ve menşei tercihinizi seçin.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">3</span>
                <h3 className="font-semibold text-gray-900">Sonucu Görün</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Hesaplanan kVA ve önerilen jeneratör kapasitesini görün. Teklif alın.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl
                       hover:bg-blue-700 transition-colors"
          >
            Başla
          </button>
        </div>
      </div>
    </div>
  );
}
