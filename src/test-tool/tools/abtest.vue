<template>
<div class="abtest">
    <ul>
        <li v-for="(item, key) of abInfo" :key="key">
            <p>{{item.desc}}</p>
            <div class="selection" v-for="info in item.list" :key="info.key">
                <p>{{info.desc}}</p>
                <div class="btn" :class="{ 'disable': info.key === item.currentKey }" @click="onClick(key, info.key, item.currentKey)">
                    {{getBtnText(info.key, item.currentKey)}}
                </div>
            </div>
        </li>
    </ul>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
    getAllAbDesc,
    AbDescInfo,
    ABTEST_VALUE_PARENT_NAME,
    getTestScheme,
    ABTEST_EVENT,
} from '../../lib/abtest';
import { EventName } from '../../lib/event';
import { setStorageValue, getStorageValue, SEP_CHAR } from '../../lib/storage';

@Component({
    components: {}
})
export default class AbTest extends Vue {
    readonly PREFIX = ABTEST_VALUE_PARENT_NAME + SEP_CHAR;
    abInfo: AbDescInfo = {};
    showMask: boolean = false;

    created() {
        getTestScheme('test_ab_tool', '测试', [
            {
                key: '0',
                desc: '这是0的描述',
                data: true
            },
            {
                key: '1',
                desc: '这是1的描述',
                data: true
            },
            {
                key: '2',
                desc: '这是2的描述',
                data: false
            }
        ]);
        this.abInfo = getAllAbDesc();
        ABTEST_EVENT.on(EventName.AbTestChange, () => {
            this.abInfo = getAllAbDesc();
        });
    }

    getBtnText(key: any, currentKey: any) {
        return key === currentKey ? '当前已选中' : '更改为此选项';
    }

    onClick(storageName: string, key: any, currentKey: any) {
        if (key === currentKey) {
            return;
        }

        setStorageValue(this.PREFIX + storageName, key);
        location.reload();
    }
}
</script>

<style lang="less" scoped>
.abtest {
    ul {
        padding: 3rem;
        overflow-y: scroll;

        li {
            display: list-item;
            text-align: -webkit-match-parent;
            margin-bottom: 2.5rem;

            p {
                font-weight: bold;
                font-size: 1.6rem;
            }

            .selection {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid gray;
                height: 4rem;

                p {
                    font-size: 1.2rem;
                    font-weight: normal;
                }

                .btn {
                    background: #ff7400;
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 8rem;
                    height: 2.5rem;
                    font-size: 1.2rem;

                    &:active {
                        opacity: 0.5;
                    }

                    &.disable {
                        background: gray;

                        &:active {
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }
}

</style>
