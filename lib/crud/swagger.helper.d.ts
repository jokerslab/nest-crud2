import { MergedCrudOptions, ParamsOptions } from '../interfaces';
import { BaseRouteName } from '../types';
export declare const swagger: any;
export declare const swaggerConst: any;
export declare const swaggerPkgJson: any;
export declare class Swagger {
    static operationsMap(modelName: string): {
        [key in BaseRouteName]: string;
    };
    static setOperation(metadata: unknown, func: any): void;
    static setParams(metadata: unknown, func: any): void;
    static setExtraModels(swaggerModels: any): void;
    static setResponseOk(metadata: unknown, func: any): void;
    static getOperation(func: any): any;
    static getParams(func: any): any[];
    static getExtraModels(target: unknown): any[];
    static getResponseOk(func: any): any;
    static createResponseMeta(name: BaseRouteName, options: MergedCrudOptions, swaggerModels: any): any;
    static createPathParamsMeta(options: ParamsOptions): any[];
    static createQueryParamsMeta(name: BaseRouteName, options: MergedCrudOptions): ({
        type: string;
        name: any;
        description: string;
        required: boolean;
        in: string;
    } | {
        schema: {
            type: string;
        };
        name: any;
        description: string;
        required: boolean;
        in: string;
    })[];
    static getQueryParamsNames(): any;
    private static getSwaggerVersion;
}
export declare function ApiProperty(options?: any): PropertyDecorator;
export declare function ApiPropertyProg(options: any, target: any, propertyKey: string): any;
