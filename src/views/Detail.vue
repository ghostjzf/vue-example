<template>
    <div class="detail-root">
        <div class="detail">
            <img :src="image" class="detail-banner" v-if="image" />
            <div class="content-container">
                <h1>{{ title }}</h1>
                <div class="content">{{ content }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DetailInfo } from "../services/types";

// 头图
// 标题
// 正文

@Component
export default class Detail extends Vue {
    title = "";
    content = "";
    image = "";

    get id() {
        return this.$route.params.id;
    }

    created() {
        const storeData = this.$store.state.detailInfos as DetailInfo[];
        const currentData = storeData.filter(
            item => String(item.id) === this.id
        )[0];

        console.log(currentData);

        this.title = currentData.title;
        this.content = currentData.content;
        this.image = currentData.image;
    }
}
</script>
<style lang="less" scoped>
.detail-root {
    position: relative;
    height: 100vh;

    .detail-banner {
        width: 100%;
    }

    .content {
        white-space: pre-wrap;
        text-align: left;
    }
}
</style>
