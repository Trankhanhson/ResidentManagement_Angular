import { ResidentApartment } from "./ResidentApartment";

export interface resident{
    ResidentId?:number;
    Name?:string;
    Address?:string;
    PhoneNumber?:string;
    Email?:string;
    Cccd?:string;
    DateOfBirth?:Date;
    Gender? :boolean;
    ResidentApartments?:any
}