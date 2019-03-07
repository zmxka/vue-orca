<template>
  <div :style="loginImg">
    <div class="group">
      <Group>
        <XInput
          title="账号"
          placeholder="请输入账号"
          v-model="account"
          ref="refUser"
          @on-change="keyUser"
          :required="false"
        ></XInput>
      </Group>
      <Group>
        <XInput
          title="密码"
          type="password"
          placeholder="请输入密码"
          v-model="password"
          ref="refPass"
          @on-change="keyPass"
          :required="false"
        ></XInput>
      </Group>
      <!--<div class="nc">-->
      <!--<drag ></drag>-->
      <!--</div>-->
      <XButton
        type="default"
        class="login-btn"
        style="border-radius: 99px"
        :gradients="['#64bcd5', '#364a9b']"
        @click.native="handleLogin"
        v-model="data"
      >开 始 使 用
      </XButton>
      <p class="forget"><a @click="find">忘记密码</a></p>
      <!--:disabled="disabled"-->
    </div>
  </div>
</template>

<script>
  import {Group, XInput, XButton} from 'vux'
  import {userLogin, getBoundaryAndObstacles} from '../api/api';
  import {setCookie} from '../utils/cookie';
  import {mapState, mapActions} from 'vuex';
  import drag from '../components/drag';

  export default {
    name: "login",
    data() {
      return {
        data: '',
        loginImg: {
          backgroundImage: 'url(' + require('../../static/img/login/back.png') + ') ',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          width: window.screen.width + 'px',
          height: window.screen.height + 'px',
          // marginTop: '-5px',
          position: 'relative'
        },
        value: false,
        account: '',
        password: '',
      }
    },
    computed: {
      ...mapState([
        'route',
        'path',
        'login',
        'isLoading',
        'shipChooseId',
        'curr_lng',
        'curr_lat',
        'curr_yaw',
        'curr_percen',
        'curr_speed',
        'rame_time',
      ]),
    },
    mounted() {
      this.find();
    },
    methods: {
      find() {
        console.log(window.screen.height);
      },

      keyUser() {
        this.value = (this.account !== '' && this.password !== '');
      },
      keyPass() {
        this.value = (this.account !== '' && this.password !== '');
      },
      // user_iconType(value) {
      //   if (value.length >= 6) {
      //     this.user = true
      //   } else {
      //     this.$vux.toast.text("用户名长度必须大于六位")
      //   }
      // },
      // pass_iconType(value) {
      //   if (value.length >= 6) {
      //     this.user = true
      //   } else {
      //     this.$vux.toast.text("密码长度必须大于六位")
      //   }
      // },
      handleLogin() {
        if (this.value) {
          userLogin({username: this.account, password: this.password}).then(res => {
            if (res.code === 200) {//当登录成功的时候，还需要将store中的变量初始化一下。
              // this.findBound();
              /* this.$store.commit('curr_state',new Array(res.data.data.totalShip));
               this.$store.commit('curr_lat',new Array(res.data.data.totalShip));
               this.$store.commit('curr_lng',new Array(res.data.data.totalShip));
               this.$store.commit('curr_yaw',new Array(res.data.data.totalShip));
               this.$store.commit('curr_percen',new Array(res.data.data.totalShip));
               this.$store.commit('rame_time',new Array(res.data.data.totalShip));
               this.$store.commit('curr_battle',new Array(res.data.data.totalShip));
               this.$store.commit('curr_speed',new Array(res.data.data.totalShip));*/

              setCookie('AppCookieToken', res.data.token);
              setCookie('account', this.account);
              setCookie('shipId', res.data.shipId);
              setCookie('totalShip', res.data.totalShip);
              this.$store.commit('cookie', true);
              this.$router.push('/home');
            } else {
              this.$vux.toast.text(res.message);
            }
          });
        } else {
          this.$vux.toast.text("用户名或密码不能为空")
        }
      },
    },
    components: {
      Group,
      XInput,
      XButton,
      drag,
    },
  }
</script>

<style lang="less" scoped>
  @toast-content-font-size: orangered;

  .group {
    position: absolute;
    left: 15%;
    top: 27%;
    width: 70%;
  }

  .group /deep/ .weui-cell {
    padding: 5.5% 0;
  }

  .group /deep/ .weui-cells {
    margin-top: 2%;
    font-size: 15px;
  }

  .group /deep/ .weui-cells:before {
    position: unset !important;
  }

  .group /deep/ .weui-cells:after {
    border-top: 4px solid rgb(56, 98, 168);
    top: 75%;
  }

  .login-btn {
    box-shadow: 0 8px 9px hsl(240, 2%, 73%);
    margin-top: 5%;
  }

  .forget {
    text-align: center;
    font-size: 90%;
    margin-top: 5%;
  }
</style>
