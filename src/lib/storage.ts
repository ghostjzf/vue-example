export const SEP_CHAR = '>';

export function setStorageValue(name: string, newValue: string) {
    const allLevelNames = name.split(SEP_CHAR);

    if (allLevelNames.length === 1) {
        localStorage.setItem(name, newValue);
        return;
    }

    const theLastChild = allLevelNames.pop()!;
    const theLastParent = allLevelNames.join(SEP_CHAR);

    let theLastParentValue = getStorageValue(theLastParent);
    if (theLastParentValue) {
        theLastParentValue[theLastChild] = parse(newValue);
    } else {
        theLastParentValue = { [theLastChild]: parse(newValue) };
    }

    // 递归赋值多级对象
    setStorageValue(theLastParent, stringify(theLastParentValue));
}

export function getStorageValue(name: string, parentContent?: string): any {
    const allLevleNames = name.split(SEP_CHAR);

    if (allLevleNames.length === 1) {
        if (parentContent) {
            return parse(parse(parentContent)[name] || '');
        }
        return parse(localStorage.getItem(name) as string);
    }

    const parent: any = parentContent ? parse(parentContent)[allLevleNames[0]] : localStorage.getItem(allLevleNames[0]);
    if (!parent) {
        return '';
    }

    // 递归获取多级对象的值
    return getStorageValue(allLevleNames.slice(1).join(SEP_CHAR), stringify(parent));
}

export function parse(str: any) {
    if (typeof str !== 'string') {
        return str;
    }

    try {
        if (!isNaN(Number(str))) {
            // '1' 会被JSON.parse()转换为 1, 类型发生变化会导致===匹配不到正确的值。
            // 不能直接用Number(str)判断, 存在'0'的情况
            return str;
        }
        return JSON.parse(str);
    } catch (e) {
        // 处理普通字符串, 比如 'xxx'
        return str || '';
    }
}

export function stringify(obj: any) {
    if (typeof obj === 'string') {
        return obj;
    } else {
        return JSON.stringify(obj, null, 2);
    }
}