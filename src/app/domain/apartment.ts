import { BuidingCategory } from "./buildingctegory";

export interface apartment{
    ApartmentId?:number;
    ApartmentName?:string;
    Building?:string;
    Space?:number;
    Floor?:number;
    CategoryId?:string | number | undefined
    BuildingCategory?:BuidingCategory
}