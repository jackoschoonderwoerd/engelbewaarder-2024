import { Consumption } from "./consumption.model";


export interface Category {

    id?: string;
    nameNl: string;
    nameEn: string;
    consumptions?: Consumption[];
    showHeaderToVisitor?: boolean;
    seqNo: number;
}
