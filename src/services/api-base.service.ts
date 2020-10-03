export abstract class ApiBaseService {

    protected buildApiPaginacaoRequest<T>(callback: (page: number, limit: number) => T) {
        return {
            page: function (page: number, limit: number) {
                return callback(page, limit);
            },
            run: function () {
                return callback(undefined, undefined);
            }
        };
    }

    protected cleanParams(params: any) {
        Object.keys(params).forEach((key) => {
            if (params[key] === undefined) {
                delete params[key];
            }
        });
        return params;
    }

}

export interface PaginacaoResponse<T> {
    docs: T[];
    total: number;
    limit: number;
    page: number;
    pages: number;
}