import { Type } from 'class-transformer';
import { getMetadataArgsStorage } from 'typeorm';
import { OmitType } from '@nestjs/swagger';
import { GetManyDefaultResponse } from '../interfaces';
import { ApiProperty, ApiPropertyProg, Swagger } from './swagger.helper';

export class SerializeHelper {
  static createGetManyDto(dto: any, resourceName: string): any {
    class GetManyResponseDto implements GetManyDefaultResponse<any> {
      @ApiProperty({ type: dto, isArray: true })
      @Type(() => dto)
      data: any[];

      @ApiProperty({ type: 'number' })
      count: number;

      @ApiProperty({ type: 'number' })
      total: number;

      @ApiProperty({ type: 'number' })
      page: number;

      @ApiProperty({ type: 'number' })
      pageCount: number;
    }

    Object.defineProperty(GetManyResponseDto, 'name', {
      writable: false,
      value: `GetMany${resourceName}ResponseDto`,
    });

    return GetManyResponseDto;
  }

  static createGetOneResponseDto(resourceName: string): any {
    class GetOneResponseDto {}

    Object.defineProperty(GetOneResponseDto, 'name', {
      writable: false,
      value: `${resourceName}ResponseDto`,
    });

    return GetOneResponseDto;
  }

  static createJoinedResponseDto(dto: any, resourceName: string, joinTree: any): any {
    // Depth first search of nested object

    const allRelations = getMetadataArgsStorage().relations;
    const allTargets = [...new Set(allRelations.map((relation) => relation.target))];

    // create a object to hold the Classes

    const models: any = {};
    const recursiveCreateDto = function (dto: any, resourceName: string, joinTree: any): any {
      const objRelations = allRelations.filter((relation) => relation.target === dto);

      const related: any = objRelations.map((relation) => relation.propertyName);

      // Strip out any relations
      class JoinedResponseDto extends OmitType(dto, related) {}
      Object.defineProperty(JoinedResponseDto, 'name', {
        writable: false,
        value: `${resourceName}ResponseDto`,
      });

      models[resourceName] = JoinedResponseDto;
      const relatedKeys = Object.keys(joinTree);
      relatedKeys.forEach((key) => {
        const relatedObj = objRelations.find((relation) => relation.propertyName === key);
        if (relatedObj && typeof relatedObj.type === 'function') {
          //const relatedObjName = relatedObj.type.name;
          //const relatedObjType = allTargets.find((target) => target.name === relatedObjName);
          const relatedObjType = relatedObj.type();
          if (relatedObjType) {
            const modelName = `${resourceName}Joined${relatedObjType.name}`;
            recursiveCreateDto(relatedObjType, modelName, joinTree[key]);
            // Add in the joined object to the api property
            ApiPropertyProg({ type: models[modelName], required: false }, JoinedResponseDto.prototype, key + 'jiggle');
          }
        } else {
          // We did not find the join in the entity
          console.log(`Could not find join ${key} in ${resourceName}`);
        }
      });
    };

    recursiveCreateDto(dto, resourceName, joinTree);
    models.get = models[`${resourceName}ResponseDto`];
    return models;
  }
}
