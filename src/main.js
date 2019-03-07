// The Vue build version to lo`ad with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { sync } from 'vuex-router-sync'
import { ToastPlugin, AlertPlugin, ConfigPlugin, ConfirmPlugin } from 'vux'
import toastMessages from './utils/global/toast'
import store from './store'
import variable from './utils/global/variable'
import * as socketApi from './utils/socket'
import {verification} from './api/api';
import {getCookie, delCookie} from './utils/cookie'
import App from './App'
import Vue from 'vue'
import VueAMap from 'vue-amap'
import router from './router/index'

Vue.use(VueAMap);
Vue.use(ToastPlugin);
Vue.use(AlertPlugin);
Vue.use(ConfigPlugin);
Vue.use(ConfirmPlugin);
Vue.use(toastMessages);


VueAMap.initAMapApiLoader({
  key: "4dfcf4a526cd20ff39e71d327d72c677",
  plugin: [
    "AMap.Autocomplete", //输入提示插件
    "AMap.PlaceSearch", //POI搜索插件
    "AMap.Scale", //右下角缩略图插件 比例尺
    "AMap.OverView", //地图鹰眼插件
    "AMap.ToolBar", //地图工具条
    "AMap.MapType", //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    "AMap.PolyEditor", //编辑 折线多，边形
    "AMap.CircleEditor", //圆形编辑器插件
    "AMap.Geolocation" //定位控件，用来获取和展示用户主机所在的经纬度位置
  ],
  uiVersion: "1.0"
});

Vue.prototype.$variable = variable;
Vue.prototype.$socketApi = socketApi;

Vue.config.productionTip = false;

const FastClick = require('fastclick');
FastClick.attach(document.body);

sync(store, router);
// location.reload();

router.beforeEach((to, from, next) => {
  verification().then(res => {

    if (res.code === 200) {
      if (to.path !== '/') {
        store.commit('cookie', true);
        next()
      } else {
        store.commit('cookie', true);
        next('/home')
      }
    } else {
      if (getCookie('AppCookieToken')) {
        delCookie('AppCookieToken');
      }
      if (to.path !== '/') {
        store.commit('cookie', false);
        next('/');
      } else {
        store.commit('cookie', false);
        next()
      }
    }
  });
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
});
