<template>
  <div class="amap">
    <div v-if="canSign===1" :style="homeImg">
      <FloatButton v-bind:text="'撤销'" v-bind:item-width="40" v-bind:item-height="40"
                   v-bind:coefficientHeight="0.4" v-on:onFloatBtnClicked="deleteOne">
        <i slot="icon" class="deleteOne"></i>
      </FloatButton>
      <FloatButton v-bind:text="'清除'" v-bind:item-width="40" v-bind:item-height="40"
                   v-bind:coefficientHeight="0.5" v-on:onFloatBtnClicked="clear">
      </FloatButton>
    </div>
    <eye v-if="showEye" v-bind:text="'查看'" v-bind:item-width="33" v-bind:item-height="33"
         v-bind:coefficientHeight="0.43" v-bind:isleft="false"></eye>
    <!--<FixedButton v-bind:text="'切换地图'" v-bind:item-width="35" v-bind:item-height="35" v-bind:coefficientHeight="0.5" v-on:onFloatBtnClicked="" v-bind:isleft="false"></FixedButton>-->
    <!--<FixedButton  v-bind:text="'轨迹显示'" v-bind:item-width="35" v-bind:item-height="35" v-bind:coefficientHeight="0.57" v-on:onFloatBtnClicked="" v-bind:isleft="false"></FixedButton>-->
    <!--<p>这里其实根据船的数目有多个</p>-->
    <Ocmap></Ocmap>
    <div v-for="ship in chuans" :key="ship.id">
      <div v-if="ship.value">
        <cruise v-bind:id="ship.id"></cruise>
        <clean v-bind:id="ship.id"></clean>
        <detect v-bind:id="ship.id"></detect>
      </div>
    </div>
    <div v-if="show">
      <cruise v-bind:id="-1"></cruise>
      <clean v-bind:id="-1"></clean>
      <detect v-bind:id="-1"></detect>
    </div>
    <!--    <p>当任务结束的时候弹出询问框，暂时先不管是否再来一圈？？</p>-->
    <div v-transfer-dom>
      <confirm v-model="showEnd"
               :title="'id为'+savefinish+'船执行任务已完成，是否再来一圈？'"
               @on-cancel="onConfirmEnd"
               @on-confirm="anotherCricle">
        <!--<p style="text-align:center;">是否再来一圈</p>-->
      </confirm>
    </div>

    <toast v-model="showToast" text="任务正在开启中"></toast>
    <toast v-model="startError" text="出现错误"></toast>
    <toast v-model="startNetError" text="网络出现故障，请重新开始任务"></toast>

  </div>
</template>

<script>
  import Cruise from "../common/cruise"
  import Clean from '../common/clean'
  import Detect from '../common/detect'
  import Ocmap from '../common/Ocmap'
  import FloatButton from "../components/floatButton"
  import FixedButton from "../components/fixedButton"
  import eye from "../common/view"
  import store from '../store'
  import {end} from '../utils/socket'
  import {TransferDom, Confirm, Toast} from 'vux'
  import {addRoute} from "../api/api";
  import {start} from "../utils/socket";

  //fzp123  123456
  let map;
  let marker;
  let amap;
  let i = 0;
  export default {
    name: "home",
    data() {
      return {
        // getCookie("totalShip")
        count: 4,
        showEnd: false,
        showToast: false,
        startError: false,
        startNetError: false,
        savefinish: -1,
        homeImg: {
          backgroundImage: 'url(' + require('../../static/img/clean/leftShadow.png') + ') ',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          // width: window.screen.width + 'px',
          // height: window.screen.height + 'px',
          // marginTop: '-5px',
          position: 'relative'
        }
        //showEye:false,
      }
    },
    computed: {
      finishTofuthree() {
        return this.$store.getters.finishTofuthree;
      },
      canSign() {
        return this.$store.getters.canSign;
      },
      present() {
        return store.getters.shipChooseId;
      },
      show() {
        return (store.getters.shipChooseId === -1);//用于未上电状态的提醒。
      },
      chuans() {
        let temp = [];
        let object;
        for (let i = 0; i < this.count; i++) {
          object = {id: i, value: false};
          if (i === store.getters.shipChooseId) {
            object = {id: i, value: true};
          }
          temp.push(object);
        }
        console.log(temp);
        return temp;
      },
      presentStatus() {
        //console.log("dedewfwf//"+this.$store.getters.curr_state[this.present]);
        // this.showEye = this.$store.getters.curr_state[this.present]>=0;
        return this.$store.getters.curr_state[this.present];
      },
      showEye() {
        return this.$store.getters.curr_state[this.present] >= 0;
      }


    },
    methods: {

      onCancel() {
        console.log('on cancel')
      },
      anotherCricle() {//再来一圈
        // let task = "ship"+this.finishTofuthree;
        let object = this.$store.getters.lastTask[this.savefinish];
        console.log(object);
        addRoute(object).then(res => {
          // console.log("res:====" + res.data);
          console.log(res);
          if (res.code !== 200) {
            // this.$toast(res.data.message);
            this.startError = true;
            // console.log("错误" + res.message);
          } else {//正确
            let id = res.data;
            // console.log("id:" + res.data);
            start(id);//给船发指令
            this.showToast = true;//弹出提示框

            //console.log("fwefwefew"+getCookie("ship"+this.id).turns);
          }
        });
        this.$store.commit('cruiseShow', false);
        this.$store.commit('cleanShow', false);
        this.$store.commit('detectShow', false);

      },
      onConfirmEnd() {
        this.$store.commit('cruiseShow', false);
        this.$store.commit('cleanShow', false);
        this.$store.commit('detectShow', false);
        console.log("结束");
        end();
        //this.showEnd = true;
      },
      onConfirm(msg) {//确定再来一圈？
        console.log('on confirm')
        if (msg) {
          alert(msg);
        }
        //  this.present = this.temp.value;  //把刚才临时保存的值给当前的值
        store.commit('shipChooseId', this.temp.value);
        this.headerTop = this.temp.name;
        // 确定要切换船，就要切换

      },
      deleteOne() {
        store.commit('canDelete', 1 + 2 * (i++));
      },
      clear() {
        store.commit('canDelete', 2 + 2 * (i++));
      },
    },
    watch: {
      finishTofuthree(newval) {
        //  console.log('////////////////////状态变为-3');
        //  console.log('newval'+newval);
        if (newval !== -1) {
          this.savefinish = newval;
          // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          this.showEnd = true;
        }
        this.$store.commit('finishTofuthree', -1);
      }
    },

    components: {
      Cruise,
      Clean,
      Detect,
      Ocmap,
      Confirm,
      Toast,
      FloatButton,
      eye,
      FixedButton
    },
    directives: {
      TransferDom
    },
  }
</script>

<style lang="less">
  /* 覆盖高德logo样式 */
  .amap .amap-logo {
    right: -10000px !important;
    left: auto !important;
    display: none;
  }

  .amap .amap-copyright {
    bottom: -10000px;
    display: none;
  }

  .deleteOne {
    background-image: url(../../static/img/top.png);
    height: 100px;
  }
</style>
