import { MEASUREMENT_SYSTEMS } from "./enums";

export interface Size {
    _id: string;
    name: string;
    system: MEASUREMENT_SYSTEMS;
}