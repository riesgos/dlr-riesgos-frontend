import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from "@ngrx/effects";
import { from, of } from "rxjs";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { API_Datum, API_DatumReference, API_ScenarioState, BackendService, isApiDatum } from "../services/backend.service";
import { ConfigService } from "../services/config.service";
import { DataService } from "../services/data.service";
import { MapService } from "../services/map.service";
import * as AppActions from "./actions";
import { RiesgosProduct, isRiesgosUnresolvedRefProduct, isRiesgosResolvedRefProduct } from "./state";


@Injectable()
export class Effects {

    private loadScenarios$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AppActions.scenarioLoadStart),
            switchMap(() => {
                return this.backendSvc.loadScenarios();
            }),
            map(scenarios => {
                return AppActions.scenarioLoadSuccess({ scenarios });
            })
        );
    });

    private executeStep$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AppActions.stepExecStart)
        )
    });

    constructor(
        private actions$: Actions,
        private configSvc: ConfigService,
        private backendSvc: BackendService,
        private dataSvc: DataService,
        private mapSvc: MapService,
    ) {}
}






function convertFrontendDataToApiState(products: RiesgosProduct[]): API_ScenarioState {
    const data: (API_Datum | API_DatumReference)[] = [];
    for (const product of products) {

        const datum: any = {
            id: product.id
        };

        if (product.options) {
            datum.options = product.options;
        }

        if (isRiesgosUnresolvedRefProduct(product) || isRiesgosResolvedRefProduct(product)) {
            datum.reference = product.reference;
        } 
        
        else if (product.value) {
            datum.value = product.value;
        }

        data.push(datum);
    }
    const apiState: API_ScenarioState = {
        data
    };
    return apiState;
}

function convertApiDataToRiesgosData(apiData: (API_Datum | API_DatumReference)[]): RiesgosProduct[] {
    
    const riesgosData: RiesgosProduct[] = [];

    for (const apiProduct of apiData) {
        
        const prod: RiesgosProduct = {
            id: apiProduct.id
        };

        if ((apiProduct as any).options) {
            prod.options = (apiProduct as any).options;
        }

        if (isApiDatum(apiProduct)) {
            prod.value = apiProduct.value;
        } 
        
        else {
            prod.reference = apiProduct.reference;
        }

        riesgosData.push(prod);
    }
    return riesgosData;
}

