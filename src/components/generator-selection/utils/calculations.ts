import type {
  SelectedDevice,
  CalculationResult,
  UsageEnvironment,
  UsageType,
  StepLoadPercent,
} from "../types";
import calculationConfig from "../../../data/generator-selection/calculation-config.json";

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
export function getSafetyMarginForEnvironment(environmentId: string): number {
  const margins = calculationParameters.safetyMargins;

  switch (environmentId) {
    case "residential":
      return margins.home;
    case "retail":
    case "events":
      return margins.commercial;
    case "factory":
    case "construction":
    case "agriculture":
    case "mining":
      return margins.industrial;
    case "hospital":
    case "telecom":
      return margins.critical;
    default:
      return margins.commercial;
  }
}

/**
 * Get demand factor based on environment
 */
export function getDemandFactor(environments: UsageEnvironment[]): number {
  if (environments.length === 0) {
    return calculationParameters.simultaneityFactors.commercial;
  }

  return Math.max(...environments.map((environment) => environment.demandFactor));
}

/**
 * Get safety margin based on selected environments
 */
export function getSafetyMargin(environments: UsageEnvironment[]): number {
  if (environments.length === 0) {
    return calculationParameters.safetyMargins.commercial;
  }

  return Math.max(
    ...environments.map((environment) =>
      getSafetyMarginForEnvironment(environment.id),
    ),
  );
}

/**
 * Get usage type multiplier
 */
export function getUsageTypeMultiplier(usageType: UsageType): number {
  switch (usageType) {
    case "standby":
      return 1.0;
    case "prime":
      return 1.1;
    case "continuous":
      return 1 / 0.7;
  }
}

/**
 * Get step load multiplier based on first step load percentage
 */
export function getStepLoadMultiplier(stepLoadPercent: StepLoadPercent): number {
  switch (stepLoadPercent) {
    case "any":
      return 1.0;
    case "0-25":
      return 1.0;
    case "0-50":
      return 1.1;
    case "0-75":
      return 1.2;
    case "0-100":
      return 1.35;
  }
}

/**
 * Calculate total and recommended kVA from selected devices
 */
export function calculateKva(
  devices: SelectedDevice[],
  environments: UsageEnvironment[],
  usageType: UsageType = "standby",
  stepLoadPercent: StepLoadPercent = "any",
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
      largestMotorKva: 0,
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
  const demandFactor = getDemandFactor(environments);
  const safetyMargin = getSafetyMargin(environments);
  const usageMultiplier = getUsageTypeMultiplier(usageType);
  const stepLoadMultiplier = getStepLoadMultiplier(stepLoadPercent);
  const adjustedTotalWatt = totalWatt * usageMultiplier;
  const adjustedTotalKva = totalKva * usageMultiplier;

  // Calculate recommended kVA
  // Use the higher of: (total * demand * safety * usage) or (starting kVA * stepLoad)
  const calculatedKva = totalKva * demandFactor * safetyMargin * usageMultiplier;
  const startingWithStepLoad =
    startingKva * 1.1 * stepLoadMultiplier * usageMultiplier;
  const recommendedKva = Math.max(calculatedKva, startingWithStepLoad);

  return {
    totalWatt: Math.round(adjustedTotalWatt),
    totalKva: Math.round(adjustedTotalKva * 10) / 10,
    startingKva: Math.round(startingKva * 10) / 10,
    recommendedKva: Math.ceil(recommendedKva),
    safetyMargin,
    demandFactor,
    hasThreePhase,
    largestMotorKva: Math.round(largestMotorKva * 10) / 10,
  };
}

/**
 * Get kVA range label
 */
export function getKvaRangeLabel(kva: number): string {
  const range = calculationConfig.kvaRanges.find(
    (r) => kva >= r.min && kva < r.max,
  );
  return range ? `${range.label} (${range.typical})` : "Özel";
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
