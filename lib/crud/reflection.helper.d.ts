import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { ArgumentsHost } from '@nestjs/common';
import { BaseRoute, MergedCrudOptions, AuthOptions } from '../interfaces';
import { BaseRouteName } from '../types';
import { CrudActions } from '../enums';
export declare class R {
    static set(metadataKey: any, metadataValue: any, target: unknown, propertyKey?: string | symbol): void;
    static get<T extends any>(metadataKey: any, target: unknown, propertyKey?: string | symbol): T;
    static createCustomRouteArg(paramtype: string, index: number, pipes?: any[], data?: any): any;
    static createRouteArg(paramtype: RouteParamtypes, index: number, pipes?: any[], data?: any): any;
    static setDecorators(decorators: (PropertyDecorator | MethodDecorator)[], target: any, name: string): void;
    static setParsedRequestArg(index: number): any;
    static setBodyArg(index: number, pipes?: any[]): any;
    static setCrudOptions(options: MergedCrudOptions, target: any): void;
    static setRoute(route: BaseRoute, func: unknown): void;
    static setInterceptors(interceptors: any[], func: unknown): void;
    static setRouteArgs(metadata: any, target: any, name: string): void;
    static setRouteArgsTypes(metadata: any, target: any, name: string): void;
    static setAction(action: CrudActions, func: unknown): void;
    static setCrudAuthOptions(metadata: any, target: any): void;
    static getCrudAuthOptions(target: any): AuthOptions;
    static getCrudOptions(target: any): MergedCrudOptions;
    static getAction(func: unknown): CrudActions;
    static getOverrideRoute(func: unknown): BaseRouteName;
    static getInterceptors(func: unknown): any[];
    static getRouteArgs(target: any, name: string): any;
    static getRouteArgsTypes(target: any, name: string): any[];
    static getParsedBody(func: unknown): any;
    static getContextRequest(ctx: ArgumentsHost): any;
}
