export function sort_alpha<T>(callback: (a: T, b: T) => { a: string, b: string }) {
    // Use toUpperCase() to ignore character casing
    return function (a, b) {
        const values = callback(a, b);

        const bandA = values.a.toUpperCase();
        const bandB = values.b.toUpperCase();

        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }
}

export function merge<T>(items: T[][]) {
    return items.reduce((i, c) => i.concat(c), []);
}