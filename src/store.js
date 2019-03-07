import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage:window.localStorage
})

const state = {
  cruiseShow: false,
  cleanShow: false,
  detectShow: false,
  cookie: false,
  isLoading: false,

  canSign: -1,
  signMethod: -1,
  canDelete: 0,
  shipChooseId: -1,//当前船的id
  startTask: [0, 0],  //第一位类型，第二位是状态位
  root: '',//开始任务时路径
  area: '',//区域路径
  saveTaskRoot: '',
  saveTaskarea: '',
  activeTask: [],//zhoulei 活动中的任务 activeTask[0]为空表示船0没有任务 activeTask[0]='0;a,b;'船0有路径任务
                 // activeTask[0]='1;a,b;' 船0有水质任务 activeTask[0] = '2;a,b';船0有清洁任务
  boundsAndObstacles: [],//边界障碍集合
  saveRoute:[],
  finishTaskShip:-1,//
  finishTofuthree:-1,
  curr_state:[0,0,0],
  curr_lat:[34.247559,34.247005,34.248211],
  curr_lng:[108.89662,108.898846,108.896261],
  curr_yaw:[90,30,20],
  curr_percen:[],//当前电量的百分比
  rame_time:[],//剩余电量可以支持的时间
  curr_battle:[],//当前电量
  curr_speed:[],//当前船速
  finish_time:[],
 // receive:[],
  shipRoad:[],//历史路径
  lastTask:[],
  historyRoute:[],
  showdraw:0,
};

export default new Vuex.Store({
  Plugins:[vuexLocal.plugin],
  state,
  getters: {
    cruiseShow: state => {
      return state.cruiseShow; // 让外界能获取 show
    },
    cleanShow: state => {
      return state.cleanShow;
    },
    detectShow: state => {
      return state.detectShow;
    },
    cookie: state => {
      return state.cookie;
    },
    canSign: state => {
      return state.canSign;
    },
    signMethod: state => {
      return state.signMethod;
    },
    canDelete: state => {
      return state.canDelete;
    },
    shipChooseId: state => {
      return state.shipChooseId;
    },
    startTask: state => {
      return state.startTask;
    },
    root: state => {
      return state.root;
    },
    area: state => {
      return state.area;
    },
    curr_state: state => {
      return state.curr_state;
    },
    curr_lat: state => {
      return state.curr_lat;
    },
    curr_lng: state => {
      return state.curr_lng;
    },
    curr_yaw: state => {
      return state.curr_yaw;
    },
    curr_percen: state => {
      return state.curr_percen;
    },
    rame_time: state => {
      return state.rame_time;
    },
    curr_battle: state => {
      return state.curr_percen;
    },
    curr_speed: state => {
      return state.curr_speed;
    },
    activeTask: state => {
      return state.activeTask; // 让外界能获取 show
    },
    boundsAndObstacles: state => {
      return state.boundsAndObstacles;
    },
    saveTaskRoot: state => {
      return state.saveTaskRoot;
    },
    saveTaskarea: state => {
      return state.saveTaskarea;
    },
    saveRoute: state => {
      return state.saveRoute;
    },
    finishTaskShip: state => {
      return state.finishTaskShip;
    },
    /*    receive:state => {
          return state.receive;
        },*/
    finishTofuthree: state => {
      return state.finishTofuthree;
    },
    shipRoad: state => {
      return state.shipRoad;
    },
    lastTask:state => {
      return state.lastTask;
    },
    historyRoute:state=>{
      return state.historyRoute;
    },
    showdraw:state=>{
      return state.showdraw;
    },
    finish_time:state=>{
      return state.finish_time;
    }
  },
  mutations: {
    cruiseShow(state, value) { // 让外界能改变 show
      if (value !== undefined) {
        state.cruiseShow = value;
      } else {
        state.cruiseShow = !state.cruiseShow;
      }
    },
    cleanShow(state, value) {
      if (value !== undefined) {
        state.cleanShow = value;
      } else {
        state.cleanShow = !state.cleanShow;
      }
    },
    detectShow(state, value) {
      if (value !== undefined) {
        state.detectShow = value;
      } else {
        state.detectShow = !state.detectShow;
      }
    },
    cookie(state, value) {
      if (value !== undefined) {
        state.cookie = value;
      } else {
        state.cookie = !state.cookie;
      }
    },
    UPDATE_LOADING(state, status) {
      state.isLoading = status
    },


    canSign(state, value) {
      if (value !== undefined) {
        state.canSign = value;
      } else {
        state.cansign = !state.cansign;
      }
    },
    signMethod(state, value) {
      if (value !== undefined) {
        state.signMethod = value;
      } else {
        state.signMethod = !state.signMethod;
      }
    },
    canDelete(state, value) {
      if (value !== undefined) {
        state.canDelete = value;
      } else {
        state.canDelete = !state.canDelete;
      }
    },
    shipChooseId(state, value) {
      if (value !== undefined) {
        state.shipChooseId = value;
      } else {
        state.shipChooseId = !state.shipChooseId;
      }

    },
    startTask(state, value) {
      if (value !== undefined) {
        state.startTask = value;
      } else {
        state.startTask = !state.startTask;
      }

    },
    root(state, value) {
      if (value !== undefined) {
        state.root = value;
      } else {
        state.root = !state.root;
      }

    },
    area(state, value) {
      if (value !== undefined) {
        state.area = value;
      } else {
        state.area = !state.area;
      }

    },
    curr_state(state, value) {
      if (value !== undefined) {
        state.curr_state = value;
      } else {
        state.curr_state = !state.curr_state;
      }
    },
    curr_lng(state, value) {
      if (value !== undefined) {
        state.curr_lng = value;
      } else {
        state.curr_lng = !state.curr_lng;
      }
    },
    curr_yaw(state, value) {
      if (value !== undefined) {
        state.curr_yaw = value;
      } else {
        state.curr_yaw = !state.curr_yaw;
      }
    },
    curr_lat(state, value) {
      if (value !== undefined) {
        state.curr_lat = value;
      } else {
        state.curr_lat = !state.curr_lat;
      }
    },
    curr_percen(state, value) {
      if (value !== undefined) {
        state.curr_percen = value;
      } else {
        state.curr_percen = !state.curr_percen;
      }
    },
    rame_time(state, value) {
      if (value !== undefined) {
        state.rame_time = value;
      } else {
        state.rame_time = !state.rame_time;
      }
    },
    curr_battle(state, value) {
      if (value !== undefined) {
        state.curr_battle = value;
      } else {
        state.curr_battle = !state.curr_battle;
      }
    },
    curr_speed(state, value) {
      if (value !== undefined) {
        state.curr_speed= value;
      } else {
        state.curr_speed= !state.curr_speed;
      }
    },
    activeTask(state, value) {
      if (value !== undefined) {
        state.activeTask = value;
      } else {
        state.activeTask = !state.activeTask;
      }
    },
    boundsAndObstacles(state, value) {
      if (value !== undefined) {
        state.boundsAndObstacles = value;
      } else {
        state.boundsAndObstacles = !state.boundsAndObstacles;
      }
    },
    saveTaskRoot(state, value) {
      if (value !== undefined) {
        state.saveTaskRoot = value;
      } else {
        state.saveTaskRoot = !state.saveTaskRoot;
      }
    },
    saveTaskarea(state, value) {
      if (value !== undefined) {
        state.saveTaskarea = value;
      } else {
        state.saveTaskarea = !state.saveTaskarea;
      }
    },
    saveRoute(state, value) {
      if (value !== undefined) {
        state.saveRoute = value;
      } else {
        state.saveRoute = !state.saveRoute;
      }
    },
    finishTaskShip(state, value) {
      if (value !== undefined) {
        state.finishTaskShip = value;
      } else {
        state.finishTaskShip = !state.finishTaskShip;
      }
    },
    /*    receive(state,value){
          if(value !== undefined){
            state.receive = value;
          }else{
            state.receive = !state.receive;
          }
        },*/
    finishTofuthree(state, value) {
      if (value !== undefined) {
        state.finishTofuthree = value;
      } else {
        state.finishTofuthree = !state.finishTofuthree;
      }
    },
    shipRoad(state, value) {
      if (value !== undefined) {
        state.shipRoad = value;
      } else {
        state.shipRoad = !state.shipRoad;
      }
    },
    lastTask(state,value){
      if(value !== undefined){
        state.lastTask = value;
      }else{
        state.lastTask = !state.lastTask;
      }
    },
    historyRoute(state,value){
      if(value !== undefined){
        state.historyRoute = value;
      }else{
        state.historyRoute = !state.historyRoute;
      }
    },
    showdraw(state,value){
      if(value !== undefined){
        state.showdraw = value;
      }else{
        state.showdraw = !state.showdraw;
      }
    },
    finish_time(state,value){
      if(value !== undefined){
        state.finish_time = value;
      }else{
        state.finish_time = !state.finish_time;
      }
    }
  },
  actions: { // 让外界能通过异步调用的方式 改变 show
    cruiseShow({commit}, value) {
      commit('cruiseShow', value);
    },
    cleanShow({commit}, value) {
      commit('cleanShow', value);
    },
    detectShow({commit}, value) {
      commit('detectShow', value);
    },
    cookie({commit}) {
      commit('cookie');
    },
    canSign({commit}) {
      commit('canSign');
    },
    signMethod({commit}) {
      commit('signMethod');
    },
    canDelete({commit}) {
      commit('canDelete');
    },
    shipChooseId({commit}) {
      commit('shipId');
    },
    startTask({commit}) {
      commit('startTask');
    },
    root({commit}) {
      commit('root');
    },
    area({commit}) {
      commit('area');
    },
    curr_state({commit}) {
      commit('curr_state');
    },
    curr_lat({commit}) {
      commit('curr_lat');
    },
    curr_lng({commit}) {
      commit('curr_lng');
    },
    curr_yaw({commit}) {
      commit('curr_yaw');
    },
    curr_percen({commit}) {
      commit('curr_percen');
    },
    rame_time({commit}) {
      commit('rame_time');
    },
    curr_battle({commit}) {
      commit('curr_battle');
    },
    curr_speed({commit}) {
      commit('curr_speed');
    },
    activeTask({commit}) {
      commit('activeTask');
    },
    boundsAndObstacles({commit}) {
      commit('boundsAndObstacles');
    },
    saveTaskRoot({commit}) {
      commit('saveTaskRoot');
    },
    saveTaskarea({commit}) {
      commit('saveTaskarea');
    },
    saveRoute({commit}) {
      commit('saveRoute');
    },
    finishTaskShip({commit}) {
      commit('finishTaskShip');
    },
    /*    receive ({commit}) {
          commit('receive');
        },*/
    finishTofuthree({commit}) {
      commit('finishTofuthree');
    },
    shipRoad({commit}) {
      commit('shipRoad');
    },
    lastTask ({commit}) {
      commit('lastTask');
    },
    historyRoute({commit}) {
      commit('historyRoute');
    },
    showdraw({commit}) {
      commit('showdraw');
    },
    finish_time({commit}) {
      commit('finish_time');
    },
  },
});
