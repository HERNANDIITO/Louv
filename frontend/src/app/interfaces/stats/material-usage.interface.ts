import { MaterialUsageItem } from "./material-usage-item.interface";

export interface MaterialUsageResponse {
    result: 'OK';
    materialUsage: {
        designed: MaterialUsageItem[];
        bought: MaterialUsageItem[];
    };
}