export function filter(text: string = '', itens: Array<any>, label: (item) => string) {
    const textClean = clean(text);
    if (itens && text) {
        return sortByInputFirst(
            textClean,
            itens
                .filter(item => clean(label(item)).indexOf(textClean) > -1)
                .sort((before, after) => clean(label(before)).indexOf(textClean) - clean(label(after)).indexOf(textClean)),
            label
        );
    } else {
        return itens;
    }
}

export function sortByInputFirst(text: string, itens: Array<any>, label: (item) => string) {
    const first = [];
    const others = [];

    const textClean = clean(text);
    itens.forEach((item, i) => {
        const labelClean = clean(label(item));
        labelClean.indexOf(textClean) === 0 ? first.push(item) : others.push(item);
    });
    return [...first, ...others];
}

export function clean(text: string) {
    return cleanAccents(text).toLocaleLowerCase().trim();
}

export function cleanAccents(text: string = '') {
    const accentsMap = [{
        'Ã': 'A',
        'Â': 'A',
        'Á': 'A',
        'ã': 'a',
        'â': 'a',
        'á': 'a',
        'à': 'a',
        'É': 'E',
        'Ê': 'E',
        'È': 'E',
        'é': 'e',
        'ê': 'e',
        'è': 'e',
        'Í': 'I',
        'Î': 'I',
        'Ì': 'I',
        'î': 'I',
        'í': 'i',
        'ì': 'i',
        'Ô': 'O',
        'Õ': 'O',
        'Ó': 'O',
        'Ò': 'O',
        'ô': 'o',
        'õ': 'o',
        'ó': 'o',
        'ò': 'o',
        'Ú': 'U',
        'Ù': 'U',
        'ú': 'u',
        'ù': 'u',
        'ç': 'c'
    }
    ];
    return text.replace(/[^A-Za-z0-9\[\] ]/g, (char) => {
        return accentsMap[char] || char;
    });
}

export function cleanTags(text: string = '') {
    return text.replace(/<\/?[^>]+(>|$)/g, '');
}

export function highlight(label: string = '', text: string = '', subStringStart: number = 0) {

    const labelClean = clean(label);
    const queryClean = clean(text);

    if (labelClean.substring(subStringStart).indexOf(queryClean) < 0) {
        return label;
    } else {
        const start = labelClean.substring(subStringStart).indexOf(queryClean) + (subStringStart || 0);
        const end = start + queryClean.length;

        if (isInsideTag(labelClean, end) !== undefined) {
            return highlight(label, text, isInsideTag(labelClean, end));
        } else {
            const highlighted = '<b>' + label.substring(start, end) + '</b>';
            return label.substring(0, start) + highlighted + label.substring(end);
        }
    }
}

export function isInsideTag(text: string, start: number) {
    let tagEnd: number;
    let count = start;
    while (count <= text.length) {
        let char = text[count];
        if (char === '<') {
            break;
        } else if (char === '>') {
            tagEnd = count;
            break;
        }
        count++;
    }
    return tagEnd;
}