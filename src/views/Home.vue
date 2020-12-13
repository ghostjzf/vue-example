<template>
    <div class="home">
        <slider @onTabChange="onTabChange" />
        <div ref="topInviteButton" class="button-container">
            <heartbeat-button :disable="isEnd" :fixed="showBottomInviteBtn" />
        </div>
        <div class="countdown-container" v-if="remainTimeData">
            <span>限</span>
            <span class="num">{{remainTimeData.days}}</span>
            <span>天</span>
            <span class="num">{{remainTimeData.hours}}</span>
            <span>时</span>
            <span class="num">{{remainTimeData.minutes}}</span>
            <span>分</span>
            <span class="num">{{remainTimeData.seconds}}</span>
            <span>秒</span>
        </div>
        <banner :src="bannerSrc" />
        <home-recommend v-show="!showVideo" />
        <video-list v-show="showVideo" />
        <div class="blank">

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Slider from "../components/Slider.vue";
import Banner from "../components/Banner.vue";
import HomeRecommend from "../components/HomeRecommend.vue";
import VideoList from "../components/VideoList.vue";
import { Countdown, RemainTimeData } from '../lib/countdown';
import { after, before, measure } from "../lib/decorator";
import HeartbeatButton from "../components/HeartbeatButton.vue";

// 切换slider的时候，视频 tab下面展示videolist, 其他tab下面展示首页推荐

@Component({
    components: {
        Slider,
        Banner,
        HomeRecommend,
        VideoList,
        HeartbeatButton
    }
})
export default class Home extends Vue {
    readonly BANNER_LIST = [
        "https://img.tukuppt.com//ad_preview/00/11/13/5c9940242bf11.jpg!/fw/780",
        "https://img.tukuppt.com//ad_preview/00/03/56/5c98abb074bdd.jpg!/fw/780",
        "https://img.tukuppt.com//ad_preview/00/10/15/5c992911709f7.jpg!/fw/780",
        "https://img.tukuppt.com//ad_preview/00/19/70/5c9a0504de105.jpg!/fw/780",
        "http://pic.616pic.com/bg_w1180/00/14/61/bjDQ7hTsKA.jpg!/fw/1120",
        "https://img.tukuppt.com//ad_preview/00/10/15/5c992911709f7.jpg!/fw/780",
        "https://img.tukuppt.com//ad_preview/00/19/70/5c9a0504de105.jpg!/fw/780",
        "http://pic.616pic.com/bg_w1180/00/14/61/bjDQ7hTsKA.jpg!/fw/1120"
    ];
    targetIntersectionObserver: IntersectionObserver | null = null;
    remainTimeData: RemainTimeData | null = null;
    showBottomInviteBtn: boolean = false;
    endTime: number = new Date('2020/12/20').getTime();
    isEnd: boolean = false;

    bannerSrc: string = this.BANNER_LIST[0];
    showVideo = false;

    $refs: {
        topInviteButton: HeartbeatButton;
    }

    mounted() {
        this.initObserve();
        this.initCountdown();
    }

    private initObserve() {
        if (!this.$refs.topInviteButton || this.targetIntersectionObserver) {
            return;
        }
        this.targetIntersectionObserver = new IntersectionObserver(entries => {
            const { isIntersecting, intersectionRatio } = entries[0];
            const targetIsVisible = isIntersecting && intersectionRatio >= 0;
            this.showBottomInviteBtn = !targetIsVisible;
        });
        this.targetIntersectionObserver.observe(this.$refs.topInviteButton as any);
    }

    @before(() => console.log('开始初始化倒计时'))
    @after(() => console.log('初始化倒计时完毕'))
    @measure
    private initCountdown() {
        if (!this.endTime) {
            return;
        }

        const countdown = new Countdown(this.endTime);

        countdown.on('countdown', (remainTimeData: RemainTimeData) => {
            this.remainTimeData = remainTimeData;
        });

        countdown.on('stop', () => {
            this.remainTimeData = null;
            this.isEnd = true;
        });
    }

    private destroyed() {
        this.targetIntersectionObserver?.disconnect();
    }

    onTabChange(index: number) {
        console.log(index);
        if (index === 1) {
            this.showVideo = true;
        } else {
            this.showVideo = false;
        }
        this.bannerSrc = this.BANNER_LIST[index];
    }
}
</script>
<style lang="less" scoped>
.button-container {
    height: 4.5rem;
}
.countdown-container {
    margin-top: 4.5rem;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: #a15717;
    display: flex;
    align-items: center;
    justify-content: center;

    .num {
        width: 2.1rem;
        height: 1.7rem;
        line-height: 1.7rem;
        margin: 0 0.4rem 0 0.4rem;
        background: #a5662e;
        border-radius: 20%;
        text-align: center;
        font-weight: bold;

        font-size: 1.3rem;
        color: #ffffff;
    }
}
.blank {
    height: 60rem;
    width: 100%;
}
</style>