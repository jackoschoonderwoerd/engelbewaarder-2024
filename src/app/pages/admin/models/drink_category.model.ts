import { Consumption } from "./consumption.model";


export interface DrinkCategory {
    name: string;
    seqNo: number;
    drinks: Consumption[];
    id?: string
}
