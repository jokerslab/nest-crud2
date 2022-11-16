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

    const objRelations = allRelations.filter((relation) => relation.target === dto);

    const related: any = objRelations.map((relation) => relation.propertyName);

    class SimpleResponseDto extends OmitType(dto, related) {}
    Object.defineProperty(SimpleResponseDto, 'name', {
      writable: false,
      value: `${resourceName}ResponseDto`,
    });
    // Strip out any relations
    // create a object to hold the Classes

    const models: any = {};

    // for any relations in the join options, add them to the dto
    const relatedKeys = Object.keys(joinTree);
    if (relatedKeys.length > 0) {
      const rel = objRelations.find((r) => r.propertyName === relatedKeys[0]);
      if (rel) {
        const targetClass: any = allTargets.find((t: any) => t.name.toLowerCase() === relatedKeys[0]);
        if (targetClass) {
          class RelatedResponseDto extends targetClass {}
          Object.defineProperty(RelatedResponseDto, 'name', {
            writable: false,
            value: `${resourceName}${relatedKeys[0]}ResponseRelatedDto`,
          });
          models[RelatedResponseDto['name']] = RelatedResponseDto;

          ApiPropertyProg(
            { type: RelatedResponseDto, required: false },
            SimpleResponseDto.prototype,
            relatedKeys[0] + 'jiggle',
          );
        } else {
          console.log('targetClass not found', relatedKeys[0]);
        }
      } else {
        console.log('No relation found for ', relatedKeys[0]);
      }
    }
    models.get = SimpleResponseDto;
    return models;
  }
}
