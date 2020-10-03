export function buildApiPaginacaoRequest<T>(callback: (page: number, length: number) => T) {
    return function (page: number, length: number) {
        return callback(page, length);
    }
}