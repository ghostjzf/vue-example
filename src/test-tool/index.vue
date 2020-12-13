<template >
    <div class="test-tool">
        <div class="entry-button" ref="entry" :class="{ active: entryButtonActive }" @click="toggleTools">
            <div class="icon-tool"></div>
        </div>
        <div class="test-tools" v-show="toolsVisible">
            <div class="nav-bar">
                <div 
                    class="item"
                    v-for="(tool, index) in tools"
                    :key="tool.key"
                    :class="{ active: index === currentToolIndex }"
                    @click="changeTool(index)"
                >
                    {{tool.label}}
                </div>
            </div>
            <div class="tools">
                <keep-alive>
                    <component v-bind:is="currentTool.key" />
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import Abtest from './tools/abtest.vue';

import displace from 'displacejs';

@Component({
    components: {
        Abtest,
    }
})
export default class TestTool extends Vue {
    tools = [
        {
            key: 'abtest',
            label: 'AB测试'
        }
    ];
    currentToolIndex: number = 0;
    entryButtonActive: boolean = false;
    toolsVisible: boolean = false;

    $refs: {
        entry: HTMLElement;
    };

    get currentTool() {
        return this.tools[this.currentToolIndex];
    }

    mounted() {
        this.repositionEntry();
        displace(this.$refs.entry, {
            onTouchStart: () => {
                this.entryButtonActive = true;
            },
            onTouchStop: () => {
                this.entryButtonActive = false;
            }
        });
        window.addEventListener('resize', () => this.repositionEntry());
    }

    repositionEntry() {
        this.$refs.entry.style.left = '10px';
        this.$refs.entry.style.top = `${window.innerHeight - 50}px`;
    }

    changeTool(toolIndex: number) {
        this.currentToolIndex = toolIndex;
    }

    toggleTools() {
        this.toolsVisible = !this.toolsVisible;
    }
}
</script>

<style lang="less" scoped>
.test-tool {
    pointer-events: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100001;

    .entry-button {
        pointer-events: auto;
        position: relative;
        left: 1rem;
        width: 4rem;
        height: 4rem;
        display: flex;
        background: #000;
        opacity: 0.3;
        border-radius: 1rem;
        z-index: 1000;
        align-items: center;
        justify-content: center;

        &.active {
            opacity: 0.8;
        }

        .icon-tool {
            display: inline-block;
            vertical-align: middle;
            width: 2.4rem;
            height: 2.4rem;
            mask-position: 50% 50%;
            mask-repeat: no-repeat;
            mask-size: 100%;
            background-color: currentColor;
            color: #ffffff;
            mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTgxNDIwMTE3ODc2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjgwNDIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODc0Ljc4NSA5NTYuNGgtNzI4LjA3Yy04LjYzMyAwLTE2LjY0LTUuMTE3LTIxLjEyMi0xMi40OTYtNC40ODMtNy4zOC01LjM0Ny0xNi44NjUtMS4zNzItMjQuNTI3bDIyOS4zNjQtNDQzdi0yNjIuNTdjMC0xMy42NDYgMTIuMTkyLTIxLjgxNyAyNS44MzktMjEuODE3aDI3MS44MzRjMTMuNjQ2IDAgMjMuNjQ0IDguMTcgMjMuNjQ0IDIxLjgxOHYyNjIuNjU1bDIyMS40NjEgNDQyLjk3YzMuODI1IDcuNjYgMy42NzYgMTcuMzY1LTAuODMgMjQuNjQ0LTQuNTAyIDcuMjc4LTEyLjE4NyAxMi4zMjItMjAuNzQ4IDEyLjMyMnogbS02ODcuMzg3LTQ5LjEyaDY0Ny40NDdMNjMwLjMgNDk0LjA3N2MtMS43MTMtMy40MjQtMS40NDYtNy45NjctMS40NDYtMTEuNzk1VjI0MC4wODVINDAzLjcyN3YyNDIuMzNjMCAzLjk2My0wLjc0OSA4LjYzNS0yLjU3NyAxMi4xNTZsLTIxMy43NTIgNDEyLjcxeiBtNTYyLjcwOS02NjcuMTk1SDI5Mi45MzJjLTEzLjY0NyAwLTI0LjcxMi0xMC40LTI0LjcxMi0yNC4wNDhzMTEuMDY1LTI0LjA0NyAyNC43MTItMjQuMDQ3aDQ1Ny4xNzZjMTMuNjQ3IDAgMjQuNzEyIDEwLjQgMjQuNzEyIDI0LjA0N3MtMTEuMDY1IDI0LjA0OC0yNC43MTMgMjQuMDQ4ek0yNTUuMzQ4IDY4NS4yMjNINzYzLjkzdjUwLjE0MkgyNTUuMzQ4di01MC4xNDJ6TTQ4NC41MjEgNjUuNTIxaDUyLjQ1NnY1Mi40NTZINDg0LjUyVjY1LjUyMXogbS0xMjEuMjg3IDBoNTIuNDU1djUyLjQ1NmgtNTIuNDU1VjY1LjUyMXogbTI0Mi41NzUgMGg1Mi40NTV2NTIuNDU2SDYwNS44MVY2NS41MjF6IiBwLWlkPSI4MDQzIiBmaWxsPSIjZDQyMzdhIj48L3BhdGg+PC9zdmc+);
        }
    }

    .test-tools {
        pointer-events: auto;
        position: absolute;
        width: 100%;
        height: 80%;
        left: 0;
        bottom: 0;
        background: #ffffff;
        z-index: 500;

        .nav-bar {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border-top: 1px solid #ccc;
            width: 100%;
            height: 4rem;
            color: #333;
            background: #f3f3f3;
            font-size: 0;
            display: flex;
            flex-wrap: nowrap;

            .item {
                cursor: pointer;
                height: 3.8rem;
                line-height: 3.8rem;
                padding: 0 1rem;
                font-size: 1.2rem;
                text-align: center;
                text-transform: capitalize;
                transition: all 0.3s;
                border-bottom: 1px solid #ccc;

                &.active {
                    background: #eaeaea;
                    border-color: #1a73e8;
                }
            }
        }

        .tools {
            height: 100%;
            overflow-y: scroll;
            position: relative;
        }
    }
}

</style>
