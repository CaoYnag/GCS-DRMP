import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex'
import store from './vuex/store'
import Util from './libs/util';
import cslider from './views/cslider.vue'
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import formCreate from '@form-create/iview'
import {
    maker
} from '@form-create/iview'
import axios from 'axios'
import qs from 'qs'
import ol from 'ol'

import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import '@vuikit/theme'

Vue.use(Vuikit);
Vue.use(VuikitIcons);
Vue.config.productionTip = false;

// import createPersiste from 'vue-savedata'
Vue.prototype.$axios = axios
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(formCreate);
Vue.use(Vuex);
// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    //  store.commit('setCurrRouteNme', {currRouteNme:to.name});
    //  store.dispatch('setMenuList').then( ()=> { //因为面包屑的数据来自左侧菜单,这边先获取左侧导航数据然后根据当前路径生成面包屑
    // store.dispatch('setBreadCrumb');
    //  });
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
new Vue({
    el: '#app',
    router: router,
    store,
    render: h => h(App)
});