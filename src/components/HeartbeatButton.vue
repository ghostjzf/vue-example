<template>
    <div class="bottom-invite-button-container"  :class="{ disable, fixed }" :style="{ background: bgColor }">
        <span @click="onClickBtn" class="btn">点击我啊</span>
    </div>
        
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getTestScheme } from "../lib/abtest";

@Component
export default class HeartbeatButton extends Vue {
    @Prop({ type: Boolean, default: false }) disable: boolean;
    @Prop({ type: Boolean, default: false }) fixed: boolean;

    bgColor: string = 'white';

    onClickBtn() {
        console.log('aaa')
    }

    created() {
        this.bgColor = getTestScheme('buttonBgClolor', '按钮底色AB', [
            {
                key: '0',
                desc: '灰色',
                data: 'gray'
            },
            {
                key: '1',
                desc: '橘色',
                data: '#ff7400'
            },
            {
                key: '2',
                desc: '粉色',
                data: 'pink'
            }
        ]).data;
    }
}
</script>
<style lang="less" scoped>
@bottom-btn-container-height: 6rem;
.bottom-invite-button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    position: static;

    &.fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 199;
        height: @bottom-btn-container-height;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }

    &.disable {
        .btn {
            animation: none;
            filter: grayscale(1);
        }
    }

    .btn {
        background: #ff7400;
        width: 31.2rem;
        height: 4.5rem;
        color: white;
        font-size: 1.8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        animation: heartbeat-animation 0.75s linear infinite;
    }
}

@keyframes heartbeat-animation {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(0.9);
    }

    100% {
        transform: scale(1);
    }
}
</style>
