export interface FunnelMetric {
  label: string;
  value: number | string;
  change: number;
  percentage?: number; 
}

export interface ComplexFunnelStep {
  metrics: FunnelMetric[];
}

export interface SourceStat {
  title: string;
  visits: number;
  percentage: number;
  change: number;
  icon: any;
}