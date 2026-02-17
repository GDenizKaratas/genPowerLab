import { useCallback } from "react";
import { jsPDF } from "jspdf";
import {
  Zap,
  AlertTriangle,
  Download,
  FileText,
  Phone,
  ArrowRight,
} from "../icons";
import type {
  CalculationResult,
  UsageEnvironment,
  SelectedDevice,
  UsageType,
  GeneratorGroup,
  StepLoadPercent,
} from "../types";
import { getKvaRangeLabel, formatWatt } from "../utils/calculations";

/** Türkçe karakterleri ASCII karşılıklarına çevirir (jsPDF varsayılan fontları desteklemez) */
function tr(text: string): string {
  const map: Record<string, string> = {
    'ş': 's', 'Ş': 'S',
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ü': 'u', 'Ü': 'U',
  };
  return text.replace(/[şŞçÇğĞıİöÖüÜ]/g, (c) => map[c] || c);
}

interface ResultDisplayProps {
  result: CalculationResult;
  environments: UsageEnvironment[];
  selectedEnvironmentOptions: string[];
  motorOrigin: "europe" | "china" | "any";
  alternatorOrigin: "europe" | "china" | "any";
  devices: SelectedDevice[];
  usageType: UsageType;
  generatorGroup: GeneratorGroup;
  stepLoadPercent: StepLoadPercent;
}

const usageTypeLabels: Record<UsageType, string> = {
  standby: "Standby (Yedek)",
  prime: "Prime (Ana Güç)",
  continuous: "Continuous (7/24)",
};

const originLabels: Record<string, string> = {
  europe: "Avrupa",
  china: "Çin",
  any: "Tümü",
};

const stepLoadLabels: Record<StepLoadPercent, string> = {
  any: "Belirtilmedi",
  "0-25": "%0-25",
  "0-50": "%0-50",
  "0-75": "%0-75",
  "0-100": "%0-100",
};

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

export function ResultDisplay({
  result,
  environments,
  selectedEnvironmentOptions,
  motorOrigin,
  alternatorOrigin,
  devices,
  usageType,
  generatorGroup,
  stepLoadPercent,
}: ResultDisplayProps) {
  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(tr("GenPower - Jeneratör Seçim Raporu"), pageWidth / 2, 15, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text(
      tr(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`),
      pageWidth / 2,
      25,
      { align: "center" },
    );

    y = 45;
    doc.setTextColor(0, 0, 0);

    // Recommended kVA
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(15, y, pageWidth - 30, 25, 3, 3, "F");
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.text(tr("Önerilen Kapasite"), pageWidth / 2, y + 8, { align: "center" });
    doc.setFontSize(22);
    doc.text(`${result.recommendedKva} kVA`, pageWidth / 2, y + 19, {
      align: "center",
    });
    y += 32;

    // Range label
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(tr(getKvaRangeLabel(result.recommendedKva)), pageWidth / 2, y, {
      align: "center",
    });
    y += 10;

    // Device table
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(tr("Seçilen Cihazlar"), 15, y);
    y += 7;

    // Table header
    doc.setFillColor(243, 244, 246);
    doc.rect(15, y, pageWidth - 30, 7, "F");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text("Cihaz", 18, y + 5);
    doc.text("Adet", 110, y + 5);
    doc.text(tr("Güç"), 140, y + 5);
    doc.text("Toplam", 165, y + 5);
    y += 9;

    // Table rows
    doc.setTextColor(0, 0, 0);
    devices.forEach((device) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(9);
      doc.text(tr(device.name), 18, y + 4);
      doc.text(String(device.quantity), 113, y + 4);
      doc.text(formatWatt(device.watt), 140, y + 4);
      doc.text(formatWatt(device.watt * device.quantity), 165, y + 4);
      doc.setDrawColor(229, 231, 235);
      doc.line(15, y + 7, pageWidth - 15, y + 7);
      y += 9;
    });

    y += 5;

    // Summary stats
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(15, y, pageWidth - 30, 40, 3, 3, "F");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(tr("Hesaplama Detayları"), 20, y + 8);

    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    const details = [
      [
        tr(`Toplam Güç: ${formatWatt(result.totalWatt)}`),
        `Toplam kVA: ${result.totalKva.toFixed(1)}`,
      ],
      [
        tr(`Talep Faktörü: %${(result.demandFactor * 100).toFixed(0)}`),
        tr(`Güvenlik Marjı: x${result.safetyMargin.toFixed(2)}`),
      ],
      [
        tr(`Kullanım Tipi: ${usageTypeLabels[usageType]}`),
        tr(`Motor Menşei: ${originLabels[motorOrigin]}`),
      ],
    ];

    let detailY = y + 15;
    details.forEach(([left, right]) => {
      doc.text(left, 20, detailY);
      doc.text(right, 110, detailY);
      detailY += 6;
    });

    doc.text(tr(`Alternatör Menşei: ${originLabels[alternatorOrigin]}`), 20, detailY);
    detailY += 6;

    if (generatorGroup !== "any") {
      doc.text(tr(`Jeneratör Grubu: ${generatorGroup}`), 20, detailY);
      doc.text(
        tr(`İlk Adım Yükü: ${stepLoadLabels[stepLoadPercent]}`),
        110,
        detailY,
      );
      detailY += 6;
    }

    if (environments.length > 0) {
      doc.text(
        tr(`Kullanım Ortamı: ${environments.map((environment) => environment.name).join(", ")}`),
        20,
        detailY,
      );
      detailY += 6;
    }

    if (selectedEnvironmentOptions.length > 0) {
      doc.text(
        tr(
          `Ortam Opsiyonları: ${selectedEnvironmentOptions.map((optionId) => getOptionLabel(optionId)).join(", ")}`,
        ),
        20,
        detailY,
      );
    }

    y += 48;

    // Warnings
    if (result.hasThreePhase || result.largestMotorKva > 5) {
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(tr("Uyarılar"), 20, y);
      y += 6;

      doc.setFontSize(9);
      if (result.hasThreePhase) {
        doc.setTextColor(107, 33, 168);
        doc.text(tr("! 3 Faz bağlantı gereklidir"), 20, y);
        y += 6;
      }
      if (result.largestMotorKva > 5) {
        doc.setTextColor(180, 83, 9);
        doc.text(
          tr(`! Büyük motor: ${result.largestMotorKva.toFixed(1)} kVA başlangıç yükü`),
          20,
          y,
        );
        y += 6;
      }
    }

    // Footer
    y = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      tr("Bu rapor GenPower Lab Jeneratör Seçim Asistanı tarafından oluşturulmuştur."),
      pageWidth / 2,
      y,
      { align: "center" },
    );
    doc.text("www.genpowerlab.com/", pageWidth / 2, y + 5, { align: "center" });

    doc.save(`GenPower_Jenerator_Raporu_${result.recommendedKva}kVA.pdf`);
  }, [
    result,
    devices,
    environments,
    selectedEnvironmentOptions,
    motorOrigin,
    alternatorOrigin,
    usageType,
    generatorGroup,
    stepLoadPercent,
  ]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200">
      {/* Main Result - Compact */}
      <div className="p-4">
        {/* Recommended kVA */}
        <div className="text-center py-3 mb-3 bg-white rounded-lg border border-green-200">
          <p className="text-xs text-green-600 mb-0.5">Onerilen Kapasite</p>
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
            <p className="text-sm font-bold text-gray-900">
              {result.totalKva.toFixed(1)}
            </p>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <p className="text-[10px] text-gray-500 uppercase">Talep</p>
            <p className="text-sm font-bold text-gray-900">
              {(result.demandFactor * 100).toFixed(0)}%
            </p>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <p className="text-[10px] text-gray-500 uppercase">Motor/Alt.</p>
            <p className="text-sm font-bold text-gray-900">
              {originLabels[motorOrigin]}/{originLabels[alternatorOrigin]}
            </p>
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
            <span className="text-amber-900">
              Buyuk motor: {result.largestMotorKva.toFixed(1)} kVA baslangic
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 py-3 px-4
                       bg-gradient-to-r from-green-600 to-emerald-600 text-white
                       rounded-lg font-semibold shadow-md
                       hover:from-green-700 hover:to-emerald-700 transition-all
                       hover:shadow-lg text-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            PDF Rapor Indir
            <Download className="w-4 h-4" />
          </button>

          <a
            href="/iletisim"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                       border border-green-300 text-green-700
                       rounded-lg font-medium
                       hover:bg-green-50 transition-all text-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            Teklif Icin Iletisime Gecin
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
