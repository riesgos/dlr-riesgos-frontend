import { FeatureCollection } from "@turf/helpers";
import { ValidatorFn } from "@angular/forms";

export interface BasicParameter {
    id: string;
    name: string;
    description: string;
    defaultValue: any;
    validators: ValidatorFn[]
}

export interface StringParameter extends BasicParameter {
    parametertype: "string";
    defaultValue: string;
    datatype: "double" | "string"
}

export interface BboxParameter extends BasicParameter {
    parametertype: "bbox";
}

export interface SelectParameter extends BasicParameter {
    parametertype: "select"; 
    options: string[];
    defaultValue: string;
}

export interface FeatureSelectParameter extends BasicParameter {
    parametertype: "featureselect",
    layerId: string
}

export type Parameter = StringParameter | BboxParameter | SelectParameter | FeatureSelectParameter;

export function isParameter(object: any): object is Parameter {
    return (object["id"] && object["name"] && object["description"] && object["defaultValue"] && object["validators"]);
}
