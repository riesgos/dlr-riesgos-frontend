import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BackendService } from "../services/backend.service";
import { ConfigService } from "../services/config.service";
import { DataService } from "../services/data.service";
import { MapService } from "../services/map.service";


@Injectable()
export class Effects {

    // loadingScenarios$ = createEffect(() => {
    //     this.actions$.pipe(
    //         ofType(""),

    //     )
    // });

    constructor(
        private actions$: Actions,
        private config: ConfigService,
        private backend: BackendService,
        private data: DataService,
        private map: MapService,
    ) {}
}