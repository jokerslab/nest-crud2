"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudConfigService = void 0;
const crud_request_1 = require("@nestjsx/crud-request");
const util_1 = require("@nestjsx/util");
const deepmerge = require("deepmerge");
class CrudConfigService {
    static load(config = {}) {
        if ((0, util_1.isObjectFull)(config.queryParser)) {
            crud_request_1.RequestQueryBuilder.setOptions(config.queryParser);
        }
        const auth = (0, util_1.isObjectFull)(config.auth) ? config.auth : {};
        const query = (0, util_1.isObjectFull)(config.query) ? config.query : {};
        const routes = (0, util_1.isObjectFull)(config.routes) ? config.routes : {};
        const params = (0, util_1.isObjectFull)(config.params) ? config.params : {};
        const serialize = (0, util_1.isObjectFull)(config.serialize) ? config.serialize : {};
        CrudConfigService.config = deepmerge(CrudConfigService.config, { auth, query, routes, params, serialize }, { arrayMerge: (a, b, c) => b });
    }
}
exports.CrudConfigService = CrudConfigService;
CrudConfigService.config = {
    auth: {},
    query: {
        alwaysPaginate: false,
    },
    routes: {
        getManyBase: { interceptors: [], decorators: [] },
        getOneBase: { interceptors: [], decorators: [] },
        createOneBase: { interceptors: [], decorators: [], returnShallow: false },
        createManyBase: { interceptors: [], decorators: [] },
        updateOneBase: {
            interceptors: [],
            decorators: [],
            allowParamsOverride: false,
            returnShallow: false,
        },
        replaceOneBase: {
            interceptors: [],
            decorators: [],
            allowParamsOverride: false,
            returnShallow: false,
        },
        deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
        recoverOneBase: { interceptors: [], decorators: [], returnRecovered: false },
    },
    params: {},
};
//# sourceMappingURL=crud-config.service.js.map