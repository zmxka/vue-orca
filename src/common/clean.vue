<template>
  <div class="clean-popup">
    <popup
      v-model="showPopup"
      v-bind:height="size"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="clean-show">
        <icon v-bind:status="status" v-bind:type="'3'" v-bind:id="this.id" v-on:changeHeight="changeHeight"></icon>
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
      changeHeight(data) {
        this.size = data + "px";
      },
      /*      sign(data){
              this.$emit('sign',data);
            }*/
      // fzp 改动
      alertShow(code) {
        this.$vux.alert.show({
          title: this.error[code],
          content: this.tip[code],
        })
      }
    },
    computed: {
      status: function () {
        return store.getters.curr_state[this.id] + "";
        //return "1";
      },
      status1: function () {
        return store.getters.curr_state;
      },
      showPopup: {
        get() {
          return store.getters.cleanShow
        },
        set(value) {
          if (this.id + "" === "-1") {
            store.commit('cleanShow', false);
            this.alertShow(0);
          } else if (this.status + '' === "-11") {//船没上电
            this.alertShow(1);
          } else if(this.status +''==='-3'){
            store.commit('cleanShow', false);
          } else if (this.status > 0) {
            if (store.getters.cruiseShow || store.getters.detectShow) {//说明是从别的地方切换过来的
              store.commit('cleanShow', false);
              this.alertShow(2);
              console.log("就运行的这里");
            }
          } else {
            if (store.getters.cruiseShow || store.getters.detectShow) {
              if (value) {
                store.commit('cruiseShow', false);
                store.commit('detectShow', false);
                this.$store.commit('canSign', 0);
                //检测切换事件
              }
            }
          }
        },
      }
    },

    data() {
      return {
        size: '130px',
        error: ["暂未选船", "船尚未上电", "船正在运行"],
        tip: ["请先选择船", "请先开tip船", "请勿切换到别的任务"],
        data: store.getters.curr_state,
      };
    },
    /* watch:{
       status(newval,)
     }.*/
    props: ['id'],
    directives: {
      TransferDom
    },
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  .clean-popup {
    position: fixed;
  }

  .clean-show {
    width: 89%;
    background-color: #fff;
    margin: 8px auto;
    border: 4px solid;
    border-image: linear-gradient(to right, #364a9c, #3b86c7) 30 30;
  }

  .clean-tab .vux-swiper {
    height: 220px !important;
    background-color: #fff;
  }

  .clean-tab .weui-tabbar__item {
    float: left;
    width: 100%/3;
  }

  .clean-top .weui-tabbar__item {
    padding-top: 0.3rem;
  }

  .clean-bottom .weui-tabbar__item {
    padding-top: 0.2rem;
  }

  .clean-bottom-two .weui-tabbar__item {
    width: 50%;
    padding-top: 0.2rem;
  }

  .clean-tab .clean-button {
    line-height: 0.8rem;
    text-align: center;
  }

  .clean-button .weui-btn_mini {
    padding: 0 50px;
  }

  .weui-grid {
    padding: 13px 10px;
  }
</style>
