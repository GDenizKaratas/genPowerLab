// Device Types
export interface Device {
  id: string;
  name: string;
  defaultWatt: number;
  powerFactor: number;
  inrushMultiplier: number;
  phase: 'single' | 'three';
  description: string;
}

export interface DeviceCategory {
  id: string;
  name: string;
  icon: string;
  devices: Device[];
}

// Selected Device (with quantity and optional custom values)
export interface SelectedDevice {
  id: string;
  deviceId: string;
  name: string;
  quantity: number;
  watt: number;
  powerFactor: number;
  inrushMultiplier: number;
  phase: 'single' | 'three';
  isCustom: boolean;
  // Custom device additional fields
  customVoltage?: number;
  customAmpere?: number;
}

// Environment Types
export interface UsageEnvironment {
  id: string;
  name: string;
  icon: string;
  description: string;
  demandFactor: number;
  protectionLevel: string;
  recommendedFeatures: string[];
}

export interface UsageDuration {
  id: string;
  name: string;
  description: string;
  hoursPerDay: number;
  daysPerWeek: number;
  maintenanceInterval: string;
}

export interface Priority {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ProtectionLevel {
  name: string;
  description: string;
  ipRating: string;
  features: string[];
}

// Origin Types
export interface OriginOption {
  id: 'europe' | 'china' | 'any';
  name: string;
  description: string;
  advantages: string[];
  considerations: string[];
}

// Usage & Step Loading Types
export type UsageType = 'standby' | 'prime' | 'continuous';
export type GeneratorGroup = 'any' | 'G1' | 'G2' | 'G3';
export type StepLoadPercent = 'any' | '0-25' | '25-50' | '50-75' | '75-100';

// Calculation Types
export interface CalculationResult {
  totalWatt: number;
  totalKva: number;
  startingKva: number;
  recommendedKva: number;
  safetyMargin: number;
  demandFactor: number;
  hasThreePhase: boolean;
  largestMotorKva: number;
}

// Generator Types (placeholder for when user adds their data)
export interface Generator {
  id: string;
  model: string;
  kvaRating: number;
  motor: {
    brand: string;
    model: string;
    origin: 'europe' | 'china';
  };
  alternator: {
    brand: string;
    model: string;
  };
  origin: 'europe' | 'china';
  features: string[];
  phase: 'single' | 'three';
}

// App State
export interface SelectionState {
  // Step 1: Devices
  selectedDevices: SelectedDevice[];

  // Step 2: Usage
  selectedEnvironment: string | null;
  selectedDuration: string | null;
  selectedPriority: string | null;

  // Step 3: Preferences
  selectedOrigin: 'europe' | 'china' | 'any';

  // Calculated
  calculationResult: CalculationResult | null;

  // UI State
  activeTab: 'devices' | 'usage' | 'preferences';
  showCustomDeviceModal: boolean;
}

// Actions
export type SelectionAction =
  | { type: 'ADD_DEVICE'; payload: SelectedDevice }
  | { type: 'REMOVE_DEVICE'; payload: string }
  | { type: 'UPDATE_DEVICE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_ENVIRONMENT'; payload: string }
  | { type: 'SET_DURATION'; payload: string }
  | { type: 'SET_PRIORITY'; payload: string }
  | { type: 'SET_ORIGIN'; payload: 'europe' | 'china' | 'any' }
  | { type: 'SET_ACTIVE_TAB'; payload: 'devices' | 'usage' | 'preferences' }
  | { type: 'TOGGLE_CUSTOM_DEVICE_MODAL' }
  | { type: 'UPDATE_CALCULATION'; payload: CalculationResult }
  | { type: 'RESET' };
