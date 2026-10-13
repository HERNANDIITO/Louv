import { DonutItem } from "./donut-item.interface";

export interface BaseUsageItem {
  name: string;
  percentage: number;
  quantity: number;
  profile: DonutItem[];
  style: DonutItem[];
};