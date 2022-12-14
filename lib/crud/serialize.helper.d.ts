export declare class SerializeHelper {
    static createGetManyDto(dto: any, resourceName: string): any;
    static createGetOneResponseDto(resourceName: string): any;
    static createJoinedResponseDto(dto: any, resourceName: string, joinTree: any): any;
    static createCreateDto(dto: any, resourceName: string, exclude?: any[]): any;
}
