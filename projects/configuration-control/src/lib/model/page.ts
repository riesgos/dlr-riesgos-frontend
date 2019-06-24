import { Observable, BehaviorSubject } from 'rxjs';
import { Parameter } from 'projects/dynforms/src/lib/parameter';


export type PageState = "unavailable" | "available" | "running"  | "completedSuccessfully" | "error";


export interface Page {
    getWpsId(): string;
    getId(): string;
    getName(): string;
    getDescription(): string;
    getState(): Observable<PageState>;
    getConfig(): Parameter[];
    setState(state: PageState); // @TODO: only allow PageService to change this
    getShape(): string; // @TODO: remove this. this is too specific; only used in riesgos.
    setErrorMessage(error: string): void; // @TODO: only allow PageService to change this
    getErrorMessage(): string;
}

export function isPage(obj): obj is Page {
    return (obj["getId"] && obj["getName"] && obj["getDescription"] && obj["getState"] && obj["getConfig"]);
}

export interface PageService {
    focussedPageId(): BehaviorSubject<string>;
    getPages(): Page[];
    setConfig(parameterId: string, value: any): void;
    onSubmit(pageId: string): void;
    onReconfigureClicked(pageId: string): void;
}
