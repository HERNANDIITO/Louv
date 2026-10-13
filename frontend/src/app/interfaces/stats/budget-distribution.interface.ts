import { ChartItem } from "./chart-item.interface";

export interface BudgetDistributionResponse {
  result: 'OK';
  budgetDistribution: {
    designed: {
      budgetDist: ChartItem[];
    };
    bought: {
      budgetDist: ChartItem[];
    };
  };
}