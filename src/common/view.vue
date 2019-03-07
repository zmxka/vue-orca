<template>
  <div style="position: absolute">
    <popover placement="leftTop">
      <!--v-if="present!==-1"-->
      <div slot="content" class=" view-content">
        <div>
          <p>船体电量:{{curr_percen[shipChooseId]}}</p>
          <p>船体状态:{{curr_state[shipChooseId]}}</p>
          <p>错误信息:{{error}}</p>
          <p v-show="curr_state[shipChooseId]>0||curr_state[shipChooseId]===-2">速度:{{curr_speed[shipChooseId]}}</p>
          <p v-show="curr_state[shipChooseId]>0||curr_state[shipChooseId]===-2">完成进度:{{rame_time[shipChooseId]}}</p>
          <p v-show="curr_state[shipChooseId]>0||curr_state[shipChooseId]===-2">剩余时间:{{rame_time[shipChooseId]}}</p>
        </div>
      </div>
      <!--<button class="my-btn vux-header-right"><i style="opacity:0;color:white;font-size:20px "-->
      <!--class="el-icon-view"></i><tton>-->

      <button class="ys-float-btn"
              :style="{'width':itemWidth+'px','height':itemHeight+'px','left':left+'px','top':top+'px'}"
              ref="div">
        <!-- <slot name="icon"></slot>
         <p>{{text}}</p>-->
      </button>
    </popover>
  </div>


</template>

<script>
  import {mapState} from 'vuex';
  import {
    Popover,
  } from 'vux'

  export default {
    name: "FloatImgBtn",
    props: {
      text: {
        type: String,
        default: "默认文字"
      },
      itemWidth: {
        type: Number,
        default: 60
      },
      itemHeight: {
        type: Number,
        default: 60
      },
      gapWidth: {
        type: Number,
        default: 10
      },
      coefficientHeight: {
        type: Number,
        default: 0.5
      },
      isleft: {
        type: Boolean,
        default: true
      },


    },
    created() {
      this.clientWidth = document.documentElement.clientWidth;
      this.clientHeight = document.documentElement.clientHeight;
      this.left = this.isleft ? this.gapWidth : this.clientWidth - this.itemWidth - this.gapWidth;
      // this.left = 0;
      //this.left = this.clientWidth - this.itemWidth - this.gapWidth;
      this.top = this.clientHeight * this.coefficientHeight;
    },
    methods: {
      onBtnClicked() {
        this.$emit("onFixedBtnClicked");
      },
    },
    data() {
      return {
        timer: null,
        currentTop: 0,
        clientWidth: 0,
        clientHeight: 0,
        left: 0,
        top: 0,
      }
    },
    components: {
      Popover,
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
        'curr_state',
      ]),
      error() {
        //if(this.curr_state[this.shipChooseId]==='')
      }
    },

  }
</script>

<style lang="less" scoped>
  .ys-float-btn {
    background-color: white;
    background-image: url(../../static/img/yanjing-.png);
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    color: #666666;
    z-index: 500;
    transition: all 0.3s;
    border: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 20vw;
    img {
      width: 50%;
      height: 50%;
      object-fit: contain;
      margin-bottom: 3px;
    }
    p {
      font-size: 7px;
    }
  }

  .ys-float-btn :focus {
    outline: 0;
  }

  .view-content {
    padding: 20px;

  }
</style>

