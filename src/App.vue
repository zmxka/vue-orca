<template>
  <div id="app">
    <!--<div v-transfer-dom>-->
    <!--<loading v-model="isLoading"></loading>-->
    <!--</div>-->
    <router-view name="index" v-if="!cookie"></router-view>
    <drawer
      :show.sync="drawerVisibility"
      :show-mode="showModeValue"
      :placement="showPlacementValue"
      @on-hide="onHide"
      @on-show="onShow"
      v-if="cookie"
      :style="appImg">
      <!-- 菜单内容 -->
      <div slot="drawer" class="drawer" style="z-index: 99">
        <div class="head">
          <!-- 头像 -->
          <div class="avatar">
            <img class="avatar-img" alt="" src="../static/img/home/avatar.jpg">
          </div>
          <div class="login">
            <p class="log1">欧卡小蓝船</p>
            <p class="log2">admin</p>
          </div>
        </div>
        <group class="menu-bar">
          <cell title="设置边界及避障" link="/border" @click.native="drawerVisibility = false" is-link>
          </cell>
          <cell title="路径" :link="{ path: '/route' }" @click.native="drawerVisibility = false" is-link>
          </cell>
          <!--<cell title="数据" @click.native="drawerVisibility = false">-->
          <!--</cell>-->
          <cell title="任务" :link="{ path: '/task' }" @click.native="drawerVisibility = false" is-link>
          </cell>
          <cell title="个人设置" link="/" @click.native="drawerVisibility = false">
          </cell>
        </group>
      </div>
      <!-- 主页内容 -->
      <view-box ref="viewBox" :body-padding-top="isShowNav ? '55px' : '0'" body-padding-bottom="55px">
        <x-header
          v-if="isShowNav"
          slot="header"
          style="height:55px; width:100%; background-color:rgba(255, 255, 255, 0); position:absolute; left:0; top:0; z-index:100;"
          transition="vux-header-fade-in-right"
          :left-options="leftOptions"
          :right-options="rightOptions"
          :title="title"
          @on-click-back="onBack"
        >
          <span v-if="route.path === '/home'" slot="overwrite-left">
            <x-icon @click.native="drawerVisibility = !drawerVisibility" slot="overwrite-left" type="navicon" size="35"
                    class="over"></x-icon>
          </span>
          <!---->
          <popover placement="bottom" v-if="popoverVisibility" style="margin:-3px auto;">
            <div slot="content" class="popover-demo-content">
              <div ref="changeShipPop" class="popover-demo-content-ship" v-for="ship in shipList" :key="ship.id">
                <x-button @click.native="confirmShow(ship)" class="popover-button">
                  <i :class="ship.isSlected"></i>
                  {{ship.name}}
                </x-button>
              </div>
            </div>
            <x-button class="btn btn-default"
                      style="background-color: rgba(0, 0, 0, 0);font-size:20px;border-style:hidden;color:white;">
              {{headerTop}}
            </x-button>
          </popover>
          <a slot="right" @click="showMenus = true"><h3>返航</h3></a>
        </x-header>
        <div style="height: 100%">
          <router-view></router-view>
        </div>
        <tabbar icon-class="vux-center" slot="bottom" style="background-color: rgb(240, 240, 243);">
          <tabbar-item @click.native="cruiseShowToggle">
            <img slot="icon" src="../static/img/home/cruise.png" alt=""/>
            <img slot="icon-active" src="../static/img/home/cruiseSelected.png" alt=""/>
            <span slot="label">自主巡航</span>
          </tabbar-item>
          <tabbar-item @click.native="cleanShowToggle">
            <img slot="icon" src="../static/img/home/clean.png" alt=""/>
            <img slot="icon-active" src="../static/img/home/cleanSelected.png" alt=""/>
            <span slot="label">智慧清洁</span>
          </tabbar-item>
          <tabbar-item @click.native="detectShowToggle">
            <img slot="icon" src="../static/img/home/detect.png" alt=""/>
            <img slot="icon-active" src="../static/img/home/detectSelected.png" alt=""/>
            <span slot="label">水质监测</span>
          </tabbar-item>
        </tabbar>
      </view-box>
    </drawer>

    <div v-transfer-dom style="border-radius: 50px;">
      <confirm v-model="show"
               :title="'确定换一艘船'"
               @on-cancel="onCancel"
               @on-confirm="onConfirm"
               @on-show="onShow"
               @on-hide="onHide">
        <p style="text-align:center;">Are you sure?</p>
      </confirm>
    </div>
    <div v-transfer-dom style="border-radius: 50px;">
      <confirm v-model="showMenus"
               :title="'确定返航'"
               @on-cancel="onCancel"
               @on-confirm="startBack"
               @on-show="onShow"
               @on-hide="onHide">
        <p style="text-align:center;">Are you sure?</p>
      </confirm>
    </div>
  </div>
</template>

<script>
  import {
    Drawer,
    ViewBox,
    XHeader,
    Confirm,
    Tabbar,
    TabbarItem,
    Group,
    Cell,
    ButtonTab,
    ButtonTabItem,
    Popover,
    Checklist,
    TransferDom,
    XButton,
    Loading,
    Actionsheet,
  } from 'vux'
  import {changeShip} from './utils/socket';
  import login from './views/login';
  import {mapState, mapActions} from 'vuex';
  import {back} from "./utils/socket";

  export default {
    name: 'App',
    data() {
      return {
        drawerVisibility: false,
        showModeValue: 'overlay', // 默认：overlay 展示方式:push(推开内容区域), overlay(在内容上显示)
        showPlacementValue: 'left', // 侧边栏从那边划入
        entryUrl: document.location.href,
        appImg: {
          backgroundImage: 'url(' + require('/static/img/homeBack.png') + ') ',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          width: window.screen.availWidth + 'px',
          height: window.screen.availHeight + 'px',
        },
        // headerTop: '欧卡小蓝船',
        shipList: [{name: '浐灞01', value: 0, isSlected: 'redDot'}, {
          name: '丰庆',
          value: 1,
          isSlected: 'redDot'
        }, {name: '浐灞02', value: 2, isSlected: 'redDot'}],
        ship: ['浐灞'],


        show: false,
        //present:0,
        temp: 0,
        showMenus: false,
      }
    },
    computed: {
      ...mapState([
        'route',
        'path',
        'cookie',
        'isLoading',
        'shipChooseId',
        'curr_lng',
        'curr_lat',
        'curr_yaw',
        'curr_percen',
        'curr_speed',
        'rame_time',
      ]),
      isShowNav() {
        return this.entryUrl.indexOf('hide-nav') <= -1;
      },
      leftOptions() {
        return {
          backText: '',
          preventGoBack: true,
        }
      },
      rightOptions() {
        return {
          showMore: false,
        }
      },
      title() {
        // if (this.route.path === '/home') return '欧卡小蓝船';
        if (this.route.fullPath === '/border') return '边界及障碍';
        if (this.route.fullPath === '/route') return '路 径';
        if (this.route.fullPath === '/routeInfo?route=' + this.route.query.route) return '路 径';
        if (this.route.fullPath === '/task') return '任 务';
        if (this.route.fullPath === '/taskInfo') return '添加任务';
        if (this.route.fullPath === '/taskInfo?task=' + this.route.query.task) return '编辑任务';
        // return this.componentName ? `Demo/${this.componentName}` : 'Demo/~~'
      },
      // componentName () {
      //   if (this.route.path) {
      //     const parts = this.route.path.split('/')
      //     if (/component/.test(this.route.path) && parts[2]) return parts[2]
      //   }
      // },
      popoverVisibility() {
        if (this.route.path !== '/home') return false;
        if (this.route.path === '/home') return true;
      },


      headerTop: {
        get() {
          if (this.shipChooseId === -1) {
            return '欧卡小蓝船';
          } else {
            // console.log("改变名字");
            return this.shipList[this.shipChooseId].name;
          }
        },
        set() {

        }
      },
    },
    methods: {
      ...mapActions([
        'cruiseShow',
        'cleanShow',
        'detectShow',
      ]),
      cruiseShowToggle() {
        this.cruiseShow().then();
      },
      cleanShowToggle() {
        this.cleanShow().then();
      },
      detectShowToggle() {
        this.detectShow().then();
      },
      onBack() {
        if (this.route.fullPath === '/border') this.$router.push('/');
        if (this.route.fullPath === '/route') this.$router.push('/');
        if (this.route.fullPath === '/routeInfo?route=' + this.route.query.route) this.$router.push('/route');
        if (this.route.fullPath === '/task') this.$router.push('/');
        if (this.route.fullPath === '/taskInfo') this.$router.push('/task');
        if (this.route.fullPath === '/taskInfo?task=' + this.route.query.task) this.$router.push('/task');
      },


      onCancel() {
        console.log('on cancel')
      },
      onConfirm(msg) {//确定要换一艘船
        console.log('on confirm');
        if (msg) {
          alert(msg);
        }
        //  this.present = this.temp.value;  //把刚才临时保存的值给当前的值
        //this.$refs.changeShipPop.$children[this.temp.value].$children

        this.$store.commit('shipChooseId', this.temp.value);
        this.headerTop = this.temp.name;
        // 确定要切换船，就要切换
      },
      confirmShow(ship) {
        this.show = true;
        this.temp = ship;//临时把这个船的id存起来
      },

      onHide() {
        console.log('hide');
      },
      onShow() {
        console.log('show');
      },
      startBack() {
        back();
      }
    },
    watch: {
      shipChooseId(newvalue, oldvalue) {
        changeShip(newvalue);
        // console.log("换船了"+previous+oldvalue);
      },
      curr_state(newval){
        for(let i=0;i<this.shipList.length;i++){
          if(newval[i]===undefined||newval[i]===-11||newval[i]===-10){
            this.shipList[i].isSlected = 'redDot';
          }else{
            this.shipList[i].isSlected = 'greenDot';
          }
        }

      }
    },
    components: {
      ViewBox,
      Drawer,
      XHeader,
      Tabbar,
      TabbarItem,
      Group,
      Cell,
      ButtonTab,
      ButtonTabItem,
      Popover,
      Checklist,
      Confirm,
      XButton,
      login,
      Loading,
      Actionsheet,

    },
    directives: {
      TransferDom
    },
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';

  html {
    height: 100% !important;
    overflow-y: hidden !important;
  }

  body {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: hidden !important;
  }

  #app {
    color: #2c3e50 !important;
    width: 100% !important;
    height: 100% !important;
    font-family: Source Sans Pro, Helvetica, "microsoft yahei", sans-serif !important;
  }

  .drawer {
    background-color: #efefef !important;
    height: 100% !important;
    z-index: 999 !important;

    .menu-bar {
      margin-top: -0.2rem !important;
    }
  }

  .head {
    background: url("../static/img/home/background.png") !important;
    height: 2.2rem !important; /* 260/75 */
    width: 250px !important;
    max-width: 250px !important;
    background-size: 4.5rem 2.2rem !important;
    padding-top: 0.2rem !important;
    box-sizing: border-box !important;
  }

  .avatar {
    width: 1rem !important;
    height: 1rem !important;
    overflow: hidden !important;
    border-radius: 50% !important;
    margin-left: 0.15rem !important;

    .avatar-img {
      width: 1rem !important; /* 130/75 */
      height: 1rem !important; /* 130/75 */
    }
  }

  .login {
    color: white !important;
    margin-top: 0.1rem !important;

    .log1 {
      font-size: 0.25rem !important;
      margin-left: 0.15rem !important;
    }

    .log2 {
      font-size: 0.23rem !important;
      margin-left: 0.15rem !important;
    }
  }

  .over {
    fill: #fff !important;
    position: relative !important;
    top: -5px !important;
    left: -3px !important;
  }

  .popover-button {
    padding: 0 20.5vw !important;
    color: #FFFFFF !important;
    background-color: rgba(255, 255, 255, 0) !important;
    border-radius: 99px !important;
  }

  .greenDot {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("../static/img/green.png");
    background-position: center center;
    background-repeat: no-repeat;
  }

  .redDot {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("../static/img/red.png");
    background-position: center center;
    background-repeat: no-repeat;
  }
</style>
