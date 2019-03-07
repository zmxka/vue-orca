<template>
  <div class="cruise-popup">
    <popup
      v-model="showPopup"
      v-bind:height="size"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="cruise-show">
        <icon v-bind:status="status" v-bind:type="'1'" v-bind:id="id" v-on:changeHeight="changeHeight"></icon>
      </div>
    </popup>
  </div>
</template>

<script>
  import {Popup, XButton, Grid, GridItem, TransferDom} from 'vux'
  import Icon from '../components/icon.vue'
  import store from '../store'

  export default {
    name: "detect",
    components: {
      Popup,
      XButton,
      Grid,
      GridItem,
      Icon,
    },
    methods: {
      onTabbarIndex() {
        console.log('点击');
      },
      on_show() {
        console.log("显示");
      },
      on_hide() {
        console.log("隐藏");
      },
      changeHeight(data) {
        this.size = data + "px";
      },
      alertShow(code) {
        this.$vux.alert.show({
          title: this.error[code],
          content: this.tip[code],
        })
      }
    },
    computed: {
      status() {
        return store.getters.curr_state[this.id] + "";
        // return "0";
      },

      showPopup: {
        get() {
          return store.getters.cruiseShow
        },
        set(value) {
          if (this.id + "" === "-1") {
            store.commit('cruiseShow', false);
            this.alertShow(0);
          } else if (this.status + '' === "-11") {//船没上电
            this.alertShow(1);
          } else if(this.status +''==='-3'){
            store.commit('cruiseShow', false);
          } else if (this.status > 0) {
            if (store.getters.detectShow || store.getters.cleanShow) {//说明是从别的地方切换过来的
              store.commit('cruiseShow', false);
              this.alertShow(2);
              console.log("就运行的这里");
            }
          } else {
            if (store.getters.detectShow || store.getters.cleanShow) {
              if (value) {
                store.commit('detectShow', false);
                store.commit('cleanShow', false);
                this.$store.commit('canSign', 0);
              }
            }
          }
        },
      }
    },
    props: ['id'],
    data() {
      return {
        size: '130px',
        error: ["暂未选船", "船尚未上电", "船正在运行"],
        tip: ["请先选择船", "请先开tip船", "请勿切换到别的任务"],
      };
    },
    directives: {
      TransferDom
    },
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  .cruise-popup {
    position: fixed;
  }

  .cruise-show {
    width: 89%;
    background-color: #fff;
    margin: 8px auto;
    border: 4px solid;
    border-image: linear-gradient(to right, #364a9c, #3b86c7) 30 30;
  }

  .cruise-show .vux-swiper {
    height: 220px !important;
    background-color: #fff;
  }

  .cruise-show .weui-tabbar__item {
    float: left;
    width: 100%/4;
  }

  .cruise-top .weui-tabbar__item {
    padding-top: 0.3rem;
  }

  .cruise-show .cruise-button {
    line-height: 0.8rem;
    text-align: center;
  }

  .cruise-button .weui-btn_mini {
    padding: 0 13%;
  }

  .cruise-top .weui-grid {
    padding: 13px 10px;
  }
</style>
