<template>
  <button class="ys-float-btn"
          :style="{'width':itemWidth+'px','height':itemHeight+'px','left':left+'px','top':top+'px'}"
          ref="div"
          @click="onBtnClicked">
    <slot name="icon"></slot>
    <p>{{text}}</p>
  </button>
</template>

<script>
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
      this.left = this.clientWidth - this.itemWidth - this.gapWidth;
      //this.left =200;
      this.left = this.isleft ? this.gapWidth : this.clientWidth - this.itemWidth - this.gapWidth;
      this.top = this.clientHeight * this.coefficientHeight;
    },
    methods: {
      onBtnClicked() {
        this.$emit("onFloatBtnClicked");
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
    }
  }
</script>

<style lang="less" scoped>
  .ys-float-btn {
    background: rgb(255, 255, 255);
    /*background: url(../../static/img/top.png);*/
    /* box-shadow:0 2px 10px 0 rgba(0,0,0,0.1);*/
    border-radius: 50%;
    color: black;
    /*   color: #666666;*/
    z-index: 20;
    transition: all 0.3s;

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

    .ys-float-btn:active {
      background-color: black;
    }

  }
</style>

