import Vue from 'vue';
import App from './index.vue';

export default function init() {
    const $root = document.createElement('div');
    document.body.appendChild($root);

    new Vue({
        render: h => h(App)
    }).$mount($root);
}
