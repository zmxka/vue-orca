<template>
  <div class="route">
    <div class="route-info">
      <div class="route-masker">
        <div class="route-title">路径名称</div>
        <group>
          <x-input v-model="routeName" label-width="4em" disabled></x-input>
        </group>
      </div>
    </div>
    <div class="route-info">
      <div class="route-masker">
        <div class="route-title">路径类型</div>
        <div class="route-box">
          <checker v-model="routeType" default-item-class="route-item" selected-item-class="route-item-selected">
            <checker-item class="route-mode" value="1" disabled></checker-item>
            <checker-item class="route-mode" value="2" disabled></checker-item>
            <checker-item class="route-mode" value="3" disabled></checker-item>
          </checker>
          <div class="route-mode">
            <span class="route-mode-name">自主循迹</span>
            <span class="route-mode-name">智慧清洁</span>
            <span class="route-mode-name">水质检测</span>
          </div>
        </div>
      </div>
    </div>
    <div class="route-info">
      <div class="route-masker">
        <div class="route-title">选择时间</div>
        <group>
          <x-input v-model="time" label-width="4em" disabled></x-input>
        </group>
        <!--<div>{{}}</div>-->
        <!--<group>-->
          <!--<datetime :title="'选择时间'" format="HH:mm" v-model="value6" clear-text="清除" disabled></datetime>-->
        <!--</group>-->
      </div>
    </div>
    <div class="route-info">
      <div class="route-masker" style="height: 260px">
        <div class="route-title">选择路径</div>
        <br>
        <showMap :message="this.message"></showMap>
      </div>
    </div>
    <x-button class="route-del-btn" type="default" @click.native="delById" style="color: white">删除</x-button>
    <br>
    <br>
  </div>
</template>

<script>
  import {Masker, XButton, Selector, Datetime, Group, XInput, Checker, CheckerItem, XNumber} from 'vux';
  import showMap from '../../components/showMap'
  import {findRouteById, delRouteById} from '../../api/api';

  export default {
    name: "border",

    data() {
      return {
        message: '',
        routeId: '',
        routeName: '',
        routeType: 0,
        time: 'HH:mm',
      }
    },
    mounted() {
      this.routeId = this.$route.query.route;
      this.findById();
    },
    methods: {
      findById() {
        findRouteById({id: this.routeId}).then(res => {
          if (res.code === 200) {
            this.routeName = res.data.route_name;
            this.routeType = res.data.route_type.toString();
            this.time = this.timeStampYMDhms(res.data.time);
            console.log(res.data);
          }
        })
      },
      delById() {
        delRouteById({id: this.routeId}).then(res => {
          // this.$vux.toast(res.message);
          if (res.code === 200) {
            this.$router.push({path: '/route'});
          }
        })
      },
      timeStampYMDhms(time) {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
      }
    },
    watch: {
      'routeId': function (newData, oldData) {
        this.message = newData;
      }
    },
    components: {
      XInput,
      XNumber,
      Masker,
      XButton,
      Group,
      Datetime,
      Checker,
      CheckerItem,
      Selector,
      showMap
    },
  }
</script>

<style lang="less" scoped>
  .route {
    overflow-y: scroll;
    height: 101%;
    background-color: rgb(220, 220, 223);
  }
  .route-info {
    padding-top: 2%;
    width: 96%;
    display: inline;
    float: left;
  }
  .route-masker {
    margin-left: 4%;
    margin-top: 1%;
    padding-top: 1%;
    border-radius: 10px;
    background-color: rgba(255, 255, 255);
    box-shadow: 6px 6px 8px hsl(240, 2%, 73%);
    height: 115px;
  }
  .route-title {
    font-size: 16px;
    margin-left: 4%;
    margin-top: 1%;
  }
  .route-box {
    padding: 0 15px;
    margin-top: 3%;
    margin-left: 10%;
  }
  .route-mode {
    margin-left: 2vw;
    font-size: 3vw;
  }
  .route-mode-name {
    margin-left: 4.5vw;
  }
  .route-item {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
    margin-left: 15%;
  }
  .route-item-selected {
    border-color: green;
    background-color: green;
  }
  .route-del-btn, button.weui-btn, input.weui-btn {
    top: 2vh;
    margin-left: 20vw;
    width: 60vw;
  }
</style>
