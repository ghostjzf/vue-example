import { EventEmitter, EventName } from './event';
import { getStorageValue, SEP_CHAR, setStorageValue, stringify } from './storage';

export const ABTEST_EVENT = new EventEmitter<EventName>();
ABTEST_EVENT.emit(EventName.AbTestChange);

export const ABTEST_VALUE_PARENT_NAME = 'abTest';
export const ABTEST_DESC_PARENT_NAME = 'abSchemeDesc';

export interface TestScheme<T = any> {
    key: string;
    data: T;
    proportion?: number;
    desc?: string;
}

/**
 * @param name 当前参与ab测试的字段名称
 * @param nameCn 中文描述
 * @param schemeList ab测试方案集合
 * 调用方法如下：
 * getTestScheme('recommendHeaderImage', '头图', [
 *       {
 *           key: '0',
 *           desc: 'a用户',
 *           data: {
 *               a: 'aaaa1',
 *               other: 'aaaa2'
 *           }
 *       },
 *       {
 *           key: '1',
 *           desc: 'b用户',
 *           data: {
 *               a: 'bbbbb1',
 *               other: 'bbbb2'
 *           }
 *       },
 *   ]);
 * 其中
 *      key: any. 为每个方案需要存储在localStorage的value值, 需唯一
 *      data: any. 为自定义的与key对应的数据, 类型随意
 *      desc: string, 方案的描述
 *      proportion: number. 为每个方案所占随机的份额, 默认为1; 即如果方案集合中一共有3个方案，其中一个proportion=2, 则占比2/3.
 */
export function getTestScheme<T>(name: string, nameCn: string, schemeList: Array<TestScheme<T>>): TestScheme<T> {
    const abKeyName = ABTEST_VALUE_PARENT_NAME + SEP_CHAR + name;
    const abDescName = ABTEST_DESC_PARENT_NAME + SEP_CHAR + name;
    const averageScheme: Array<TestScheme['key']> = schemeList.reduce((pre, current) => {
        if (pre.indexOf(current.key) > -1) {
            throw new Error('TestScheme key should be unique');
        }

        // 支持proportion设置为0
        let proportion = current.proportion === undefined ? 1 : current.proportion;

        while (proportion--) {
            pre.push(current.key);
        }
        return pre;
    }, [] as Array<TestScheme['key']>);

    let abKey = getStorageValue(abKeyName) || '';
    // 有可能刚开始schemeList是a,b,c方案, 后期更改为只有a,b方案。如果之前随机到了c方案,此时需要重新设置
    if (!abKey || schemeList.every(item => item.key !== abKey)) {
        abKey = averageScheme[Math.floor(Math.random() * averageScheme.length)];
        setStorageValue(abKeyName, abKey);
        storeDesc(abDescName, nameCn, schemeList);
    }

    ABTEST_EVENT.emit(EventName.AbTestChange);
    return schemeList.find(scheme => scheme.key === abKey)!;
}

export interface AbDescInfo {
    [key: string]: {
        list: Array<{ key: any; desc: string }>;
        currentKey: any;
        desc: string;
    };
}

export function getAllAbDesc(): AbDescInfo {
    const info = getStorageValue(ABTEST_DESC_PARENT_NAME);
    const temp: any = {};
    Object.keys(info).forEach(key => {
        const currentKey = getStorageValue(ABTEST_VALUE_PARENT_NAME + SEP_CHAR + key);
        temp[key] = {
            currentKey,
            desc: info[key].desc,
            list: info[key].list,
        };
    });

    return { ...temp };
}

function storeDesc<T>(name: string, nameCn: string, schemeList: Array<TestScheme<T>>) {
    let list: any[] = [];
    if (schemeList.every(item => Boolean(item.desc))) {
        list = schemeList.map(item => ({ key: item.key, desc: item.desc }));
    }
    setStorageValue(
        name,
        stringify({
            list,
            desc: nameCn,
        })
    );
}

export interface AbValInfo {
    [key: string]: string | number;
}

export function getAllAbTestValue(): AbValInfo {
    return getStorageValue(ABTEST_VALUE_PARENT_NAME);
}
