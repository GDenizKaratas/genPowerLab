import type { SelectedDevice, CalculationResult, UsageEnvironment } from '../types';
import calculationConfig from '../../../data/generator-selection/calculation-config.json';

const { calculationParameters } = calculationConfig;

/**
 * Calculate kVA from Watt and Power Factor
 */
export function wattToKva(watt: number, powerFactor: number): number {
  return watt / (1000 * powerFactor);
}

/**
 * Calculate kVA from Voltage and Ampere (single phase)
 */
export function singlePhaseKva(voltage: number, ampere: number): number {
  return (voltage * ampere) / 1000;
}

/**
 * Calculate kVA from Voltage and Ampere (three phase)
 */
export function threePhaseKva(voltage: number, ampere: number): number {
  return (voltage * ampere * Math.sqrt(3)) / 1000;
}

/**
 * Get safety margin based on environment type
 */
export function getSafetyMargin(environmentId: string): number {
  const margins = calculationParameters.safetyMargins;

  switch (environmentId) {
    case 'home':
    case 'apartment':
      return margins.home;
    case 'office':
    case 'retail':
    case 'events':
      return margins.commercial;
    case 'factory':
    case 'construction':
    case 'agriculture':
    case 'mining':
      return margins.industrial;
    case 'hospital':
    case 'telecom':
      return margins.critical;
    default:
      return margins.commercial;
  }
}

/**
 * Get demand factor based on environment
 */
export function getDemandFactor(environment: UsageEnvironment | null): number {
  if (!environment) {
    return calculationParameters.simultaneityFactors.commercial;
  }
  return environment.demandFactor;
}

/**
 * Calculate total and recommended kVA from selected devices
 */
export function calculateKva(
  devices: SelectedDevice[],
  environment: UsageEnvironment | null
): CalculationResult {
  if (devices.length === 0) {
    return {
      totalWatt: 0,
      totalKva: 0,
      startingKva: 0,
      recommendedKva: 0,
      safetyMargin: 1.2,
      demandFactor: 0.75,
      hasThreePhase: false,
      largestMotorKva: 0
    };
  }

  // Calculate total watt
  const totalWatt = devices.reduce((sum, device) => {
    return sum + (device.watt * device.quantity);
  }, 0);

  // Calculate individual kVAs
  const deviceKvas = devices.map(device => ({
    kva: wattToKva(device.watt * device.quantity, device.powerFactor),
    inrushMultiplier: device.inrushMultiplier,
    isMotor: device.inrushMultiplier > 2, // Motors have high inrush
    phase: device.phase
  }));

  // Total running kVA
  const totalKva = deviceKvas.reduce((sum, d) => sum + d.kva, 0);

  // Check if any device is three phase
  const hasThreePhase = devices.some(d => d.phase === 'three');

  // Find largest motor for starting calculation
  const motors = deviceKvas.filter(d => d.isMotor);
  const largestMotorKva = motors.length > 0
    ? Math.max(...motors.map(m => m.kva))
    : 0;

  // Calculate starting kVA (largest motor's starting load + other running loads)
  const otherLoadsKva = totalKva - largestMotorKva;
  const startingKva = largestMotorKva > 0
    ? (largestMotorKva * motors.find(m => m.kva === largestMotorKva)!.inrushMultiplier) + otherLoadsKva
    : totalKva;

  // Get factors
  const demandFactor = getDemandFactor(environment);
  const safetyMargin = getSafetyMargin(environment?.id || 'commercial');

  // Calculate recommended kVA
  // Use the higher of: (total * demand * safety) or (starting kVA)
  const calculatedKva = totalKva * demandFactor * safetyMargin;
  const recommendedKva = Math.max(calculatedKva, startingKva * 1.1); // 10% margin on starting

  return {
    totalWatt,
    totalKva: Math.round(totalKva * 10) / 10,
    startingKva: Math.round(startingKva * 10) / 10,
    recommendedKva: Math.ceil(recommendedKva),
    safetyMargin,
    demandFactor,
    hasThreePhase,
    largestMotorKva: Math.round(largestMotorKva * 10) / 10
  };
}

/**
 * Get kVA range label
 */
export function getKvaRangeLabel(kva: number): string {
  const range = calculationConfig.kvaRanges.find(r => kva >= r.min && kva < r.max);
  return range ? `${range.label} (${range.typical})` : 'Özel';
}

/**
 * Format watt to readable string
 */
export function formatWatt(watt: number): string {
  if (watt >= 1000) {
    return `${(watt / 1000).toFixed(1)} kW`;
  }
  return `${watt} W`;
}

/**
 * Format kVA to readable string
 */
export function formatKva(kva: number): string {
  return `${kva.toFixed(1)} kVA`;
}

/**
 * Generate unique ID for selected device
 */
export function generateDeviceId(): string {
  return `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
