import { BaseUsageItem } from "./base-usage-item.interface";

export interface BaseUsageResponse {
    result: 'OK';
    baseUsage: {
        designed: BaseUsageItem[];
        bought: BaseUsageItem[];
    };
}