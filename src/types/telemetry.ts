export type NavigationTab = 'soil-lab' | 'command-center' | 'water-center' | 'ai-doctor' | 'analytics';

export interface SensorProbe {
  id: string;
  name: string;
  depthCm: number;
  batteryPct: number;
  rssi: number;
  drift: number;
  driftText: string;
  status: 'ACTIVE' | 'CALIBRATING' | 'WARNING' | 'OFFLINE';
  vwc: number;
  tempC: number;
  ec: number;
}

export interface SoilStrataLayer {
  id: string;
  name: string;
  depthRange: string;
  subtitle: string;
  vwc: number;
  ec?: number;
  color: string;
  tempC: number;
  aeration: string;
  organicMatter: number;
  description: string;
}

export interface CropProfile {
  id: string;
  commonName: string;
  scientificName: string;
  icon: string;
  targetVwcMin: number;
  targetVwcMax: number;
  targetPhMin: number;
  targetPhMax: number;
  targetTempMin: number;
  targetTempMax: number;
  matchScore: number;
  notes: string;
  synthesis: string;
}

export interface SoilMetrics {
  volumetricMoisture: number;
  moistureTarget: string;
  phBalance: number;
  phValue: number;
  nitrogen: number;
  nitrogenStatus: string;
  phosphorus: number;
  phosphorusStatus: string;
  potassium: number;
  potassiumStatus: string;
  thermalStability: number;
  thermalVariance: string;
}

export interface ProtocolAction {
  id: number;
  title: string;
  detail: string;
  completed: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  level: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
}
