<template>
    <img :src="src" alt="banner" class="banner-image" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Banner extends Vue {
    @Prop({ type: String, default: "" }) src: string;
}
</script>
<style lang="less" scoped>
.banner-image {
    width: 100%;
    height: 14rem; // 140px
    border-radius: 0.5rem;
}
</style>
