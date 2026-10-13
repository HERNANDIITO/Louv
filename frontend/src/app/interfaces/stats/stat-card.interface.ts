export interface StatCardData {
  title: string;
  value: number | string;
  change: number;
  subtitle?: string;
  chartData: number[];
  labels: string[];
}