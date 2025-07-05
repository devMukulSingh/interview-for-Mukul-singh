import { Links } from "./launch";

export type TStatus = "Success" | "Failed" | "Upcoming" | "all"

export type TApiRespons<T> = {
    data: T
}

export type TLaunchTable = {
    no: number;
    launched: string;
    location: string;
    mission: string;
    orbit: string;
    status: "Success" | "Failed" | "Upcoming";
    rocket: string;
    id: string;
};

export type TLaunchDetail = TLaunchTable & {
    flightNumber: number | undefined,
    rocketType: string | undefined,
    manufacturer: string | undefined,
    nationality: string | undefined, 
    payloadType: string | undefined ,
    launchSite: string | undefined, 
    image: string | undefined
    links: Links | undefined,
    description:string | undefined
}