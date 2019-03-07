<template>
  <div class="border">
    <div v-for="shipRoute in routeList" :key="shipRoute.id">
      <div class="border-p">
        <masker class="masker" color="(255, 255, 255)" @click.native="toInfo(shipRoute.id)">
          <div class="m-img"></div>
          <div class="m-title">
            <img class="border-img" slot="icon" src="../../../static/img/clean/gardenSelected.png" alt="">
            {{shipRoute.route_name === null ? '未定义' : shipRoute.route_name}}
            <br/>
            <div class="m-time">
              功能：
              <span v-if="shipRoute.route_type === 1">自主巡航</span>
              <span v-if="shipRoute.route_type === 2">智慧清洁</span>
              <span v-if="shipRoute.route_type === 3">水质监测</span>
            </div>
            <div class="m-time">创建时间：{{timeStampMDhm(shipRoute.time)}}</div>
          </div>
        </masker>
      </div>
    </div>
  </div>
</template>

<script>
  import {Masker,XButton} from 'vux';
  import {findFlagAndType} from '../../api/api';

  export default {
    name: "index",
    data() {
      return {
        routeList: [],
      }
    },
    mounted() {
      this.findFlags();
    },
    methods: {
      toInfo(id) {
        this.$router.push({ path: '/routeInfo?route=' + id});
      },
      findFlags() {
        findFlagAndType({ship_id: 5, flag: 1}).then(res => {
          if (res.code === 200) {
            this.routeList = res.data;
          }
        })
      },
      timeStampMDhm(time) {
        const date = new Date(time);
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        return M+D+h+m;
      }
    },
    components: {
      Masker,
      XButton,
    },
  }
</script>

<style lang="less" scoped>
  .border {
    overflow-y: scroll;
    height: 101%;
    background-color: rgb(220, 220, 223);
  }

  .border-p {
    padding-top: 2%;
    padding-left: 2%;
    width: 47%;
    display: inline;
    float: left;
  }

  .masker {
    border-radius: 10px;
    background-color: rgba(255, 255, 255);
    box-shadow: 6px 6px 8px hsl(240, 2%, 73%);
    height: 80px;
  }

  .m-img {
    padding-bottom: 33%;
  }

  .m-title {
    /*color: #fff;*/
    /*text-align: center;*/
    /* 字体阴影 */
    /*text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);*/
    /*font-weight: 500;*/
    font-size: 16px;
    position: absolute;
    left: 10px;
    /*right: 0;*/
    /*width: 100%;*/
    /*text-align: center;*/
    top: 50%;
    transform: translateY(-50%);
  }

  .border-img {
    width: 10px;
  }

  .m-time {
    font-size: 12px;
    padding-left: 15px;
    padding-top: 3px;
  }
</style>
