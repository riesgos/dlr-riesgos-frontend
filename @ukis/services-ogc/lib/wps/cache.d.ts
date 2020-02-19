import { WpsData } from "./wps_datatypes";
import { Observable } from "rxjs";
export interface Cache {
    set(input: object, output: WpsData[]): any;
    get(input: object): Observable<WpsData[] | null>;
}
export declare class FakeCache implements Cache {
    set(input: object, output: WpsData[]): void;
    get(input: object): Observable<WpsData[] | null>;
}
