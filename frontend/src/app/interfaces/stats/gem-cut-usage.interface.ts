import { GemCutUsageItem } from "./gem-cut-usage-item.interface";

export interface GemCutUsageResponse {
  result: 'OK';
  gemCutUsage: {
    designed: GemCutUsageItem[];
    bought: GemCutUsageItem[];
  };
}