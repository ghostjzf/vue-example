import axios from "axios";
import { HomeRecommendListItem, DetailInfo } from "./types";

export default class Services {
    static init() {
        axios.defaults.baseURL =
            "https://www.fastmock.site/mock/505750b853376ff038612e1d348bf716/mockflow";
    }

    // 首页推荐列表
    static async getHomeRecommendList() {
        this.init();
        // 请求回来的结果 res.data是 HomeRecommendListItem[]
        return axios
            .get<HomeRecommendListItem[]>("/homeRecommendList")
            .then(res => res.data);
    }

    // 列表数据
    static async getList() {
        this.init();
        // 请求回来的结果 res.data是 DetailInfo[]
        return axios.get<DetailInfo[]>("/list").then(res => res.data);
    }
}
