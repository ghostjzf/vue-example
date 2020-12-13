<template>
    <div class="list-page">
        <div class="input-container">
            <input
                type="text"
                v-model="search"
                class="input"
                placeholder="请输入关键字搜索"
            />
        </div>
        <div class="infinite-list-container" ref="list" @scroll="scrollEvent">
            <div class="scrollTopBtn" @click="scrollToTop" v-show="end > 20">
                回到顶部
            </div>
            <div
                class="infinite-list-phantom"
                :style="{ height: listHeight + 'px' }"
            ></div>
            <div class="infinite-list" :style="{ transform: getTransform }">
                <div
                    class="infinite-list-item"
                    v-for="item in visibleData"
                    :key="item.id"
                    @click="toDetail(item.id)"
                    :style="{
                        height: itemSize + 'px',
                        lineHeight: itemSize + 'px'
                    }"
                >
                    <div class="left-section">
                        {{ item.title[0] }}
                    </div>
                    <div class="right-section">
                        <span class="title">{{ item.title }}</span>
                        <span class="desc">{{ item.content }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from "vue-property-decorator";
import Faker from "faker";
import Service from "../services/index";
import { DetailInfo } from "../services/types";
import { RouteNames } from "../router";

@Component
export default class VirtualList extends Vue {
    public readonly itemSize: number = 100;

    // 可视区域高度
    public screenHeight: number =
        document.documentElement.clientHeight || document.body.clientHeight;

    // 可显示的列表项数
    public visibleCount: number = Math.ceil(this.screenHeight / this.itemSize);

    // 偏移量
    public startOffset = 0;
    // 起始索引
    public start = 0;
    // 结束索引
    public end: number = this.start + this.visibleCount;

    public $refs: {
        list: any;
    };

    // 用户输入的关键字
    search = "";
    // 请求到的原数据
    listData: DetailInfo[] = [];

    @Watch("listData", { deep: true })
    onListDataChange() {
        this.$store.commit("setDetailInfo", this.listData);
    }

    // computed属性
    get filterList() {
        // 关键字搜索后, 实际要展示的列表
        return this.listData.filter(
            item => item.title.indexOf(this.search) > -1
        );
    }

    // 列表总高度
    get listHeight() {
        return this.filterList.length * this.itemSize;
    }

    // 偏移量对应的style
    get getTransform() {
        return `translate3d(0,${this.startOffset}px,0)`;
    }

    // 获取真实显示列表数据
    get visibleData() {
        return this.filterList.slice(
            this.start,
            Math.min(this.end, this.filterList.length)
        );
    }

    getTenListData() {
        if (this.listData.length >= 200) {
            return [];
        }
        return new Array(10).fill({}).map(item => ({
            id: Faker.random.uuid(),
            title: Faker.name.title(),
            content: Faker.random.words()
        }));
    }

    async mounted() {
        this.listData = await Service.getList();

        this.scrollToTop();
    }

    scrollToTop() {
        this.$refs.list.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    public scrollEvent() {
        // 当前滚动位置
        const scrollTop = this.$refs.list.scrollTop;
        // 此时的开始索引
        this.start = Math.floor(scrollTop / this.itemSize);
        // 此时的结束索引
        this.end = this.start + this.visibleCount;

        if (this.end > this.listData.length) {
            this.listData = this.listData.concat(this.getTenListData());
        }

        // 此时的偏移量
        this.startOffset = scrollTop - (scrollTop % this.itemSize);
    }

    toDetail(id: number) {
        this.$router.push({
            name: RouteNames.Detail,
            params: {
                id: String(id)
            }
        });
    }
}
</script>

<style lang="less" scoped>

.list-page {
    height: 100vh;
}
.input-container {
    position: sticky;
    top: 0;
    height: 6rem;
    background: white;
}

.input {
    outline-style: none;
    border: 1px solid #cccccc;
    border-radius: 0.3rem;

    padding: 1rem;

    width: 60%;
    margin: 1rem auto;
    font-size: 1.6rem;
    text-align: center;
}

.scrollTopBtn {
    position: fixed;
    border-radius: 50%;
    font-size: 12px;
    color: white;
    background: goldenrod;
    bottom: 101px;
    right: 20px;
    z-index: 10000;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
}

.infinite-list-container {
    margin-top: 10px;
    height: 99%;
    overflow: scroll;
    position: relative;
    -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
}

.infinite-list {
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    text-align: center;
}

.infinite-list-item {
    background: white;
    box-shadow: 0 0 10px rgba(144, 144, 144, 0.15);
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 10px; */
    margin-top: 10px;
}

.left-section {
    width: 7rem;
    height: 7rem;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 2.5rem;
    font-weight: bold;
    color: white;
    background: #6ab6fc;
    border-radius: 1rem;
}

.right-section {
    height: 100%;
    margin-left: 1rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    flex-direction: column;

    .title {
        font-size: 1.4rem;
        line-height: 1.4rem;
        font-weight: 500;
        text-align: left;
    }

    .desc {
        margin-top: 1rem;
        font-size: 1.2rem;
        line-height: 1.2rem;
        font-weight: 400;
        text-align: left;

        // 展示两行，超出部分省略号

        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; // 2行
        overflow: hidden;
        -webkit-box-orient: vertical;
    }
}
</style>
