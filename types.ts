export interface DistrictData {
  id: string;
  name: string;
  powerLoad: number; // 0-100%
  temperature: number; // Celsius
  population: number; // In thousands
  creditsGenerated: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

export interface TransmissionLogEntry {
  timestamp: string;
  payload: {
    districts: DistrictData[];
    globalStats: {
      totalCredits: number;
      averageStability: number;
    }
  };
}