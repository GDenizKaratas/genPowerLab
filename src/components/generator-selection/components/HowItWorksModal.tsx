import { X, Cpu, Settings2, Calculator } from "../icons";

interface HowItWorksModalProps {
  onClose: () => void;
}

export function HowItWorksModal({ onClose }: HowItWorksModalProps) {
  const steps = [
    {
      icon: Cpu,
      title: "Cihaz listenizi oluşturun",
      description:
        "Hazır listeden cihaz ekleyin veya özel ekipman değerlerini manuel girin. Adetler değiştikçe hesap otomatik güncellenir.",
    },
    {
      icon: Settings2,
      title: "Çalışma koşullarını netleştirin",
      description:
        "Kullanım tipi, ortam, kabin, ATS ve menşei gibi tercihleri yalnızca ihtiyacınız olduğunda seçin.",
    },
    {
      icon: Calculator,
      title: "Önerilen kapasiteyi inceleyin",
      description:
        "Toplam yük, güvenlik payı ve önerilen kVA değerini görün; raporu PDF olarak indirebilirsiniz.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">
                Jeneratör seçim asistanı
              </p>
              <h2 className="text-xl font-semibold text-slate-950">
                Nasıl çalışır?
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Modalı kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-3 max-w-lg">
            Seçim süreci cihaz listesiyle başlar. Gerekli detayları ekledikçe
            sonuçlar aynı ekranda güncellenir.
          </p>
        </div>

        {/* Steps */}
        <div className="p-5 sm:p-6 space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                {/* <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600">
                  <Icon className="w-4 h-4" />
                </div> */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-white border-radius-2xl border rounded-full border-slate-200 bg-blue-600 w-8 h-8 flex items-center justify-center">
                      {String(index + 1).padStart(2)}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-950">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-900/10"
          >
            Tamam, devam et
          </button>
        </div>
      </div>
    </div>
  );
}
