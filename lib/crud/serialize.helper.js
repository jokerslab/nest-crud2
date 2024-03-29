"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeHelper = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const swagger_helper_1 = require("./swagger.helper");
class SerializeHelper {
    static createGetManyDto(dto, resourceName) {
        class GetManyResponseDto {
        }
        __decorate([
            (0, swagger_helper_1.ApiProperty)({ type: dto, isArray: true }),
            (0, class_transformer_1.Type)(() => dto),
            __metadata("design:type", Array)
        ], GetManyResponseDto.prototype, "data", void 0);
        __decorate([
            (0, swagger_helper_1.ApiProperty)({ type: 'number' }),
            __metadata("design:type", Number)
        ], GetManyResponseDto.prototype, "count", void 0);
        __decorate([
            (0, swagger_helper_1.ApiProperty)({ type: 'number' }),
            __metadata("design:type", Number)
        ], GetManyResponseDto.prototype, "total", void 0);
        __decorate([
            (0, swagger_helper_1.ApiProperty)({ type: 'number' }),
            __metadata("design:type", Number)
        ], GetManyResponseDto.prototype, "page", void 0);
        __decorate([
            (0, swagger_helper_1.ApiProperty)({ type: 'number' }),
            __metadata("design:type", Number)
        ], GetManyResponseDto.prototype, "pageCount", void 0);
        Object.defineProperty(GetManyResponseDto, 'name', {
            writable: false,
            value: `GetMany${resourceName}ResponseDto`,
        });
        return GetManyResponseDto;
    }
    static createGetOneResponseDto(resourceName) {
        class GetOneResponseDto {
        }
        Object.defineProperty(GetOneResponseDto, 'name', {
            writable: false,
            value: `${resourceName}ResponseDto`,
        });
        return GetOneResponseDto;
    }
    static createJoinedResponseDto(dto, resourceName, joinTree) {
        const allRelations = (0, typeorm_1.getMetadataArgsStorage)().relations;
        const allTargets = [...new Set(allRelations.map((relation) => relation.target))];
        const models = {};
        const recursiveCreateDto = function (dto, resourceName, joinTree) {
            const objRelations = allRelations.filter((relation) => relation.target === dto);
            const related = objRelations.map((relation) => relation.propertyName);
            class JoinedResponseDto extends (0, swagger_1.OmitType)(dto, related) {
            }
            Object.defineProperty(JoinedResponseDto, 'name', {
                writable: false,
                value: `${resourceName}ResponseDto`,
            });
            models[resourceName] = JoinedResponseDto;
            const relatedKeys = Object.keys(joinTree);
            relatedKeys.forEach((key) => {
                const relatedObj = objRelations.find((relation) => relation.propertyName === key);
                if (relatedObj && typeof relatedObj.type === 'function') {
                    const relatedObjType = relatedObj.type();
                    if (relatedObjType) {
                        const modelName = `${resourceName}Joined${relatedObjType.name}`;
                        recursiveCreateDto(relatedObjType, modelName, joinTree[key]);
                        (0, swagger_helper_1.ApiPropertyProg)({ type: models[modelName],
                            required: false,
                            isArray: (relatedObj.relationType === 'one-to-many' || relatedObj.relationType === 'many-to-many')
                        }, JoinedResponseDto.prototype, key);
                    }
                }
                else {
                    console.log(`Could not find join ${key} in ${resourceName}`);
                }
            });
        };
        recursiveCreateDto(dto, resourceName, joinTree);
        const createDto = SerializeHelper.createCreateDto(dto, resourceName);
        class UpdateDto extends (0, swagger_1.PartialType)(createDto) {
        }
        Object.defineProperty(UpdateDto, 'name', {
            writable: false,
            value: `Update${resourceName}Dto`,
        });
        models.createDto = createDto;
        models.updateDto = UpdateDto;
        models.get = models[resourceName];
        return models;
    }
    static createCreateDto(dto, resourceName, exclude = []) {
        const allRelations = (0, typeorm_1.getMetadataArgsStorage)().relations;
        const objRelations = allRelations.filter((relation) => relation.target === dto);
        const related = objRelations.map((relation) => relation.propertyName);
        const excludeList = [
            'id',
            'createdAt',
            'updatedAt',
            'archivedAt',
            'version',
            'createdBy',
            'organizationId',
            'lastUpdatedBy',
            ...exclude,
        ];
        const omitList = [...related, ...excludeList];
        class CreateDto extends (0, swagger_1.OmitType)(dto, omitList) {
        }
        Object.defineProperty(CreateDto, 'name', {
            writable: false,
            value: `Create${resourceName}Dto`,
        });
        return CreateDto;
    }
}
exports.SerializeHelper = SerializeHelper;
//# sourceMappingURL=serialize.helper.js.map