<template>
  <div class="wrap" v-if="showWrap" :class="showContent ? 'fadein' : 'fadeout'">{{text}}</div>
</template>

<script>
  export default {
    name: "toast"
  }
</script>

<style lang="less" scoped>
  .wrap{
    position: fixed;
    left: 50%;
    top: 60%;
    /*rgba(0,0,0,.35)*/
    background: #1a344b;
    padding: 10px;
    border-radius: 5px;
    transform: translate(-50%,-50%);
    color: orangered;
  }
  .fadein {
    animation: animate_in 0.25s;
  }
  .fadeout {
    animation: animate_out 0.25s;
    opacity: 0;
  }
  @keyframes animate_in {
    0% {
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  @keyframes animate_out {
    0% {
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }
</style>
