import { WpsData, WpsClient, WpsVerion } from 'projects/services-wps/src/public_api';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserconfigurableWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';




export type Product = WpsData | UserconfigurableWpsData;


export type ProcessId = string;


export enum ProcessState {
    unavailable = "unavailable",
    available = "available", 
    runing = "running", 
    completed = "completed", 
    error = "error", 
}

export class Process {
    
    private state: ProcessState;

    constructor(
        readonly id: ProcessId, 
        readonly name: string,
        readonly description: string, 
        readonly url: string, 
        readonly requiredProducts: Product[], 
        readonly providedProduct: Product,
        private wpsClient: WpsClient) {
            this.state = this.calculateState();
        }

        
    public execute(): Observable<Product> {
        if(this.state != ProcessState.available) {
            throw new Error(`Process ${this.id} cannot yet be executed!`);
        }

        this.state = ProcessState.runing;
        return this.wpsClient.executeAsync(this.url, this.id, this.requiredProducts, this.providedProduct).pipe(
            tap(_ => this.state = ProcessState.completed),
            map((results: WpsData[]) => {
                return results[0];
            })
        );
    }

    public requiresProduct(product: Product): boolean {
        return this.requiredProducts
            .map(pr => pr.id)
            .includes(product.id);
    }


    public setProduct(product: Product): void {
        let it = this.requiredProducts
            .find(prod => prod.id == product.id)
        if(it) it.data = product.data;
        this.state = this.calculateState();
    }

    public getState(): ProcessState {
        return this.state;
    }


    private calculateState(): ProcessState {
        if( this.requiredProducts.find(pr => pr.data === undefined ) ) return ProcessState.unavailable;
        if( this.providedProduct.data ) return ProcessState.completed; 
        return ProcessState.available;
    }
}