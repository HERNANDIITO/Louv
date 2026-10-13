import { GemName } from "./gem-name.interface";
import { CutName } from "./cut-name.interface";

export type GemCutUsageItem = {
    gem: GemName;
    cut: CutName;
    value: number;
};