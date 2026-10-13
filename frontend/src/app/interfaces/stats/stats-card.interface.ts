import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface StatsCard {
  title: string;
  percentage: number;
  visits: number;
  change: number;
  icon: IconDefinition;
}