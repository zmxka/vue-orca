<template>
  <div>
    <div class="icon-grid" style="text-align:center">
      <grid :show-lr-borders="false" :cols="hang">
        <div v-for="icon in icons" :key="icon.id">
          <grid-item v-if="icon.name!=='开始任务'&&icon.name!=='保存路线'" @on-item-click="Handler(icon.name)">
            <img slot="icon" v-bind:src="icon.src" alt="">
            <!--  <img slot="icon-active" v-bind:src="icon.srcSelected" alt="">-->
            <span slot="label" class="grid-center">{{icon.name}}</span>
          </grid-item>
        </div>
      </grid>
      <flexbox v-if="status+''==='0'&&signMethodSelect === false" align >
        <flexbox-item >

          <x-button type="primary" mini @click.native="fstartTask" class="my-btn" >开始任务</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" mini @click.native="fsaveRoute" class="my-btn" >保存路线</x-button>
        </flexbox-item>
      </flexbox>
      <x-button mini v-if="status+''=== '0' && signMethodSelect === true" type="primary" @click.native="fendSign"
                class="endSign-btn">结束标点
      </x-button>

    </div>

    <div v-transfer-dom>
      <popup v-model="cricleShow" position="bottom" height="35%" @on-hide="closeCricleShow"
             :is-transparent="false"
             :show-mask="false">
        <div class="popup chargeRecordPage">
          <p style="margin-bottom:30px">请选择循环圈数,最大圈数为5</p>
          <div style="text-align:center;">
            <inline-x-number width="50px" v-model="cricleNum" button-style="round" :max="cricleMax"
                             :min="cricleMin"></inline-x-number>
          </div>
          <div>
            <x-button type="primary" mini @click.native="SendCricleNum" style="margin-top:30px" class="my-btn2">确定
            </x-button>
            <x-button type="primary" mini @click.native="closeCricleShow" style="margin-top:30px" class="my-btn2">取消
            </x-button>
          </div>
          <!--    <x-button type="primary" mini @click.native="SendCricleNum" style="margin-top:30px">确定</x-button>-->
        </div>
      </popup>
    </div>


  <!--  <div v-transfer-dom>
      <popup v-model="backMethodSelect" position="bottom" height="38%" @on-hide="closebackMethodSelect"
             :is-transparent="false"
             :show-mask="false">
        <div class="popup chargeRecordPage">
          <group :title=" '返航方式'" label-align :title-color="'black'">
            <checklist :options="backMethodList" v-model="backMethod" :max="1"></checklist>
          </group>
          <div>
            <x-button type="primary" mini @click.native="setBackMethod" style="margin-top:30px" class="my-btn2">确定
            </x-button>
            <x-button type="primary" mini @click.native="closebackMethodSelect" style="margin-top:30px" class="my-btn2">
              取消
            </x-button>
          </div>
          &lt;!&ndash;   <x-button type="primary" mini @click.native="setBackMethod" style="margin-top:10px;margin-bottom:10px;">确定</x-button>&ndash;&gt;
        </div>
      </popup>
    </div>-->
    <!-- <div>选择检测时间</div>时间范围为5到15秒，用那种表一样的滑动-->
    <div v-transfer-dom>
      <popup v-model="timeSelect" position="bottom" height="50%" @on-hide="closeTimeSelect"
             :is-transparent="false"
             :show-mask="false">
        <div class="popup chargeRecordPage">
          <group-title>请选择检测时间，系统默认值为5秒</group-title>
          <picker :data='timelist' v-model='time'></picker>
          <x-button type="primary" mini @click.native="setTimeChange" style="margin-top:30px">确定</x-button>
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <popup v-model="cleanShow" position="bottom" height="35%" @on-hide="closeCleanShow"
             :is-transparent="false"
             :show-mask="false"
             :hide-on-blur="true">
        <div class="popup chargeRecordPage">

          <group :title=" '清洁方式'" label-align :title-color="'black'">
            <div class="box">
              <checker v-model="cleanTofather" default-item-class="demo2-item"
                       selected-item-class="demo2-item-selected">
                <checker-item class="mode" value="3"></checker-item>
                <checker-item class="mode" value="2" selected></checker-item>
                <checker-item class="mode" value="1"></checker-item>
              </checker>
              <div class="mode">
                <span class="mode-name">快速</span>
                <span class="mode-name">标准</span>
                <span class="mode-name">极净</span>
              </div>
            </div>
          </group>
          <div>
            <x-button type="primary" mini @click.native="setCleanChange" style="margin-top:30px" class="my-btn2">确定
            </x-button>
            <x-button type="primary" mini @click.native="closeCleanShow" style="margin-top:30px" class="my-btn2">取消
            </x-button>
          </div>
          <!-- <x-button type="primary" mini @click.native="setCleanChange" style="margin-top:10px">确定</x-button>-->
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <popup v-model="historyShow" position="bottom" height="35%" @on-hide="closeHistoryShow"
             :is-transparent="false"
             :show-mask="false" style="text-align:center">

        <div class="selectbox" ref="selectContain">
          <select v-model="historySelect">
            <!--  <option :value="historylist[0].id"  selected >{{historylist[0].route_name}}</option>-->
            <option v-for="(history,index) in historylist" name="sendSymbolId" :value="history">{{history.route_name}}
            </option>
          </select>
        </div>

        <div>
          <x-button type="primary" mini @click.native="setHistorySelect" style="margin-top:30px" class="my-btn2">确定
          </x-button>
          <x-button type="primary" mini @click.native="closeHistoryShow" style="margin-top:30px" class="my-btn2">取消
          </x-button>
        </div>

      </popup>
    </div>

    <div v-transfer-dom>
      <alert v-model="showError" :title="errorTitle[errorCode]">{{errorTip[errorCode]}}</alert>
    </div>

    <toast v-model="showToast" text="任务正在开启中"></toast>
    <toast v-model="startError" text="出现错误" type="warn"></toast>
    <toast v-model="showSuccessful" text="设置成功"></toast>
    <toast v-model="startNetError" text="网络出现故障，请重新开始任务" type="warn"></toast>
    <toast v-model="haveNoHistory" text="您暂时没有保存历史路径" type="warn"></toast>


  </div>

</template>

<script>
  import {
    TabbarItem,
    TransferDom,
    Popup,
    InlineXNumber,
    XButton,
    Grid,
    GridItem,
    Selector,
    Group,
    Popover,
    Checklist,
    Picker,
    GroupTitle,
    Alert,
    Toast,
    Flexbox, FlexboxItem,
    Cell,
    ColorPicker,
    Checker,
    CheckerItem
  } from 'vux'
  import {
    sendAreaPoint,
    start,
    end,
    recover,
    stop,
    back,
    getReceive,
    setReceive,
    getClean,
    setClean
  } from "../utils/socket";
  import {addRoute, findFlagAndType} from "../api/api";
  import store from '../store'
  import {getCookie, setCookie} from '../utils/cookie'
  // let 可以改变值， const 不可改变值
  let sign = {name: '标点', src: '../static/img/add/1.png', func: this.fsign};
  let deleteOne = {name: '撤销', src: '../static/img/clean/cancelSelected.png', func: this.fdeleteOne};
  let clear = {name: '清除标点', src: '../static/img/clean/clearSelected.png', func: this.fclear};
  let cricle = {
    name: '循环圈数',
    src: '../static/img/clean/cycles.png',
    srcSelected: '../static/img/clean/cyclesSelected.png',
    func: this.fcricle
  };
  let startTask = {
    name: "开始任务",
    src: "../static/img/add/2.png",
    srcSelected: "../static/img/add/2.png",
    func: this.fstartTask
  };
  let endTask = {
    name: "结束任务",
    src: "../static/img/add/3.png",
    srcSelected: "../static/img/add/3.png",
    func: this.fendTask
  };
  let stopTask = {
    name: "暂停任务",
    src: "../static/img/add/4.png",
    srcSelected: "../static/img/add/4.png",
    func: this.fstopTask
  };
  let reStartTask = {
    name: "继续任务",
    src: "../static/img/add/2.png",
    srcSelected: "../static/img/add/2.png",
    func: this.freStartTask
  };
  let backMethod = {
    name: "直线返航",
    src: "../static/img/clean/returnMode.png",
    srcSelected: "../static/img/clean/returnMode.png",
    func: this.fbackmethod
  };
  let startBack = {
    name: "开始返航",
    src: "../static/img/add/5.png",
    srcSelected: "../static/img/add/5.png",
    func: this.fstartBack
  };
  let endBack = {
    name: "结束返航",
    src: "../static/img/add/6.png",
    srcSelected: "../static/img/add/6.png",
    func: this.fendBack
  };
  let stopBack = {
    name: "暂停返航",
    src: "../static/img/add/7.png",
    srcSelected: "../static/img/add/7.png",
    func: this.fstopBack
  };
  let reStartBack = {
    name: "继续返航",
    src: ".../static/img/add/5.png",
    srcSelected: ".../static/img/add/5.png",
    func: this.freStartBack
  };
  let detectionTime = {
    name: "检测时间",
    src: "../static/img/add/8.png",
    srcSelected: "../static/img/add/8.png",
    func: this.fdetectionTime
  };
  let saveRoute = {name: "保存路线", src: "../static/img/add/9.png", srcSelected: "../static/img/add/9.png"};//
  let cleanliness = {
    name: "清洁程度",
    src: "../static/img/clean/cleanliness.png",
    srcSelected: "../static/img/clean/cleanliness.png"
  };//清洁程度
  let areaSign = {name: '区域标点', src: "../static/img/clean/regPlan.png", srcSelected: "../static/img/clean/regPlan.png"};
  let routeSign = {
    name: '路径标点',
    src: '../static/img/clean/routePlan.png',
    srcSelected: '../static/img/clean/routePlan.png'
  };
  let endSign = {name: '结束标点', src: '../static/img/add/1.png', srcSelected: '../static/img/add/1.png'};
  let historyRoute = {name: "历史路径", src: '../static/img/add/1.png', srcSelected: '../static/img/add/1.png'};
  //让保存路线在开始任务之后，

  //one 代码巡航功能，two代表水质功能 ，three清洁功能

  //let onegroup0 = [sign, cricle, backMethod, historyRoute, startTask, saveRoute];//刚上电状态
  let onegroup0 = [sign, cricle, historyRoute, startTask, saveRoute];//刚上电状态
//  let onegroup1 = [stopTask, endTask, backMethod, startBack];//任务进行中
  let onegroup1 = [stopTask, endTask, startBack];//任务进行中
  let onegroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let onegroupfu10 = [];//待机状态暂时不考虑
  let onegroupfu4 = [reStartBack, endBack];
  let onegroupfu3 = [];     //任务结束，要让用户选择是否保存。
  let onegroupfu2 = [endBack];//返航中
  let onegroupfu1 = [reStartTask, startBack, endTask];


  //let twogroup0 = [sign, detectionTime, backMethod, historyRoute, startTask, saveRoute];//刚上电状态
  let twogroup0 = [sign, detectionTime, historyRoute, startTask, saveRoute];//刚上电状态
 // let twogroup1 = [stopTask, endTask, backMethod, startBack];//任务进行中
  let twogroup1 = [stopTask, endTask, startBack];//任务进行中
  let twogroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let twogroupfu10 = [];//待机状态暂时不考虑
  let twogroupfu4 = [reStartBack, endBack, endTask]; //任务结束
  let twogroupfu3 = [];     //任务结束，要让用户选择是否保存。     //没有
  let twogroupfu2 = [endBack, endTask];//返航中       //任务暂停
  let twogroupfu1 = [reStartTask, startBack, endTask];    //没有
  //需要确定清理方式目前是怎么定的
  let threegroup0 = [sign, cricle,cleanliness, startTask, saveRoute];//刚上电状态,backMethod
  let threegroup1 = [stopTask, endTask,startBack];//任务进行中
  let threegroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let threegroupfu10 = [];    //待机状态暂时不考虑
  let threegroupfu4 = [reStartBack, endBack, endTask];
  let threegroupfu3 = [];     //任务结束，要让用户选择是否保存。
  let threegroupfu2 = [endBack];//返航中
  let threegroupfu1 = [reStartTask, startBack, endTask];
  let threeGroupSign = [routeSign, areaSign, historyRoute];
  let count = 0;

  //-5是返航

  let times = [[{name: '5秒', value: 5}, {name: '6秒', value: 6}, {name: '7秒', value: 7},
    {name: '8秒', value: 8}, {name: '9秒', value: 9}, {name: '10秒', value: 10},
    {name: '11秒', value: 11}, {name: '12秒', value: 12}, {name: '13秒', value: 13},
    {name: '14秒', value: 14}, {name: '15秒', value: 15}]];

  let i = 0;

  export default {
    name: "icon",
    data() {
      return {
        title: 'sign',
        //循环圈数
        cricleShow: false,
        cricleNum: 1,//循环圈数默认为1
        cricleMax: 5,
        cricleMin: 1,
        cricleNumToFather: 1,
        //标点
        canSign: 0,//能否标点  除了撤销一个和撤销全部以外全部都要给我置成0
        signMethodSelect: false,
        signMethodList: ['路径点', '区域点'],
        signMethod: ['路径点'],  //0路径点 1水质点 2区域点
        signMethodToFather: -1,


        //是否撤销 0不能撤销，1 撤销上一个，2全部撤销
        canDelete: 0,//需要在对方执行操作之后给我变回来。


        //  backMethod:1,//返航方式有三种：直线返航、原地等待和 原线返航。不同方式
        backMethodSelect: false,
        backMethodList: ['原路返航', '直线返航', '原地等待'],
        backMethod: ['原路返航'],
        backMethodToFather: '原路返航',

        //检测时间
        timelist: times,
        timeSelect: false,
        time: [5],
        timeToFather: 5,
        //清洁程度
        cleanShow: false,
        cleanTofather: '2',
        //历史路线
        historyShow: false,
        historySelect: 1,
        historylist: [],
        nodatatext: '我是谁',

        deleteOne: false,//如何告诉对方要撤销一个点？
        deleteAll: false,//全部撤销。

        startTask: 0,

        saveRoute: 0,

        height: 130,   //高度用来做自适应，让外面知道应该给多高的popup

        showToast: false,
        showSuccessful: false,
        startError: false,
        startNetError: false,
        haveNoHistory: false,
        // toastCode:-1,
        // toastTip:["任务开启","设置成功"],
        showError: false,
        errorCode: -1,
        errorTitle: ["区域未闭合或无路径标点", '尚未标点'],
        errorTip: ["请合理标注区域和路径", '请合理标点之后再点击开始'],
        tryAgain: false,


        obj: {},
      }
    },
    computed: {
      area() {
        return store.getters.area;

      },
      root() {
        return store.getters.root;
      },

      hang() {
        return 3;
       // return (this.status === '0' && this.signMethodSelect === false) || this.status === "-1" || this.status === "1" ? 4 : 3;
      },
      // saveRoute(){
      //   return store.getters.saveRoute;
      //  },
      icons: {
        get() {
          if (this.status + "" !== "0") {
            this.height = 130;
          }
          if (this.type + "" === "3") {
            this.type = "3";
            console.log("此时的类型" + this.type);
            if (this.status === '0' && this.signMethodSelect === true) {
              console.log("设置高度" + this.type);
              this.height = 185;
              return threeGroupSign;
            }
            switch (this.status) {
              case '0':
                console.log("eeeee");
                this.height = 185;
                return threegroup0;
              case '-11':
                return threegroupfu11;
              case '1':
                return threegroup1;
              case '-10':
                return threegroupfu10;
              case '-4':
                return threegroupfu4;
              case '-3':
                return threegroupfu3;
              case '-2':
                return threegroupfu2;
              case '-1':
                return threegroupfu1;
              default:
                break;
            }
            if (this.status > 0) {
              return twogroup1;
            }
          } else if (this.type + "" === "2") {
            this.type = "2";
            //  console.log("此时的状态"+this.type);
            switch (this.status) {
              case '0':
                console.log("/////////////////");
                this.height = 185;
                return twogroup0;
              case '-11':
                return twogroupfu11;
              case '0':
                return twogroup0;
              case '-10':
                return twogroupfu10;
              case '-4':
                return twogroupfu4;
              case '-3':
                return twogroupfu3;
              case '-2':
                return twogroupfu2;
              case '-1':
                return twogroupfu1;
              default:
                break;
            }
            if (this.status > 0) {
              return twogroup1;
            }

          } else if (this.type + "" === "1") {
            this.type = "1";
            // console.log("此时的状态"+this.type);
            switch (this.status) {
              case '0':
                this.height = 185;
                return onegroup0;
              case '-11':
                return onegroupfu11;
              case '0':
                return onegroup0;
              case '-10':
                return onegroupfu10;
              case '-4':
                return onegroupfu4;
              case '-3':
                return onegroupfu3;
              case '-2':
                return onegroupfu2;
              case '-1':
                return onegroupfu1;
              default:
                break;
            }
            if (this.status > 0) {
              return onegroup1;
            }
          }

        },
      },
      set(icons) {
        return icons;
      },
      //  console.log("张涵想要的数据："+this.status);


    },
    methods: {
      fsign() {
        if (this.type === "3") {
          this.canSign = 1;
          //保存
          this.signMethodSelect = true;
          //this.icon = threeGroupSign;
        } else {
          this.canSign = 1;
          if (this.type === "2") {
            this.signMethodToFather = 1;
          } else {
            this.signMethodToFather = 0;//正常的路径点
          }
          store.commit('canSign', this.canSign);
          store.commit('signMethod', this.signMethodToFather);
          //使得标点的时候弹框下去
          // if(store.getters.detectShow){
          //   store.commit('detectShow', false);
          // }else if(store.getters.cleanShow) {
          //   store.commit('cleanShow', false);
          // }else if(store.getters.cruiseShow){
          //   store.commit('cruiseShow', false);
          // }

        }
      },
      frouteSign() {
        this.canSign = 1;
        this.$store.commit('canSign', 1);//给了可以标点，但是为啥不能？
        this.$store.commit('signMethod', 3);
      },
      fareaSign() {
        this.canSign = 1;
        this.$store.commit('canSign', 1);
        this.$store.commit('signMethod', 2);
      },
      fendSign() {
        this.canSign = 0;
        this.$store.commit('canSign', this.canSign);
        this.signMethodSelect = false;
      },
      // fdeleteOne() {
      //   this.canDelete = 1 + 2 * i;
      //   i++;
      //   store.commit('canDelete', this.canDelete);
      // },
      // fclear() {
      //   this.canDelete = 2 + 2 * i;
      //   i++;
      //   store.commit('canDelete', this.canDelete);
      //
      // },
      fcricle() {
        this.canSign = 0;
        store.commit('canSign', 0);  //不准标点了
        if (store.getters.cruiseShow || store.getters.detectShow || store.getters.cleanShow) {
          //console.log("关闭其它");
          store.commit('cruiseShow', false);
          store.commit('detectShow', false);
          store.commit('cleanShow', false);
        }

        this.cricleShow = true;
      },
      fstartTask() {
        this.canSign = 0;
        store.commit('canSign', 0);  //不准标点了
        this.startTask = (this.startTask + 1) % 10;
        console.log(this.$store.getters.root);
        console.log(this.area);
        //如果没有标点，应该提示。
        let temp = [parseInt(this.type), this.startTask];

        if (this.tryAgain) {//出现网络故障,总之就是有问题，想再来一次
          //console.log("dhfwehf说明出现网络问题");
          sendAreaPoint(this.id, this.area, this.root, this.cleanTofather);//将区域点进行处理，得到realroute。//将点拿去处理。
          this.addOneRoute();
        } else {
          store.commit("startTask", temp);
        }

      },
      fendTask() {
        end();
      },
      fstopTask() {
        stop();
      },
      freStartTask() {
        recover();
      },
      fbackmethod() {
        this.canSign = 0;
        store.commit('canSign', 0);  //不准标点了
        this.backMethodSelect = true;

      },
      fstartBack() {
        back();
      },
      fendBack() {
        end();
      },
      fstopBack() {
        stop();
      },
      freStartBack() {
        recover();
      },
      fdetectionTime() {
        this.timeSelect = true;
        this.canSign = 0;
        store.commit('canSign', 0);  //不准标点了

      },
      fsaveRoute() {
        //this.canSign = 0;
        // store.commit('canSign',0);  //不准标点了
        // console.log("save");
        //对方还需要判空，这一部分不需要我做。
        //需要考虑路径为空的情况，还需要考虑不匹配的情况。
        this.saveRoute = (this.saveRoute + 1) % 10;
        let temp = [parseInt(this.type), this.saveRoute];
        //给了出去当前的类型，
        store.commit("saveRoute", temp);
      },
      fcleanliness() {
        this.cleanShow = true;
      },
      fhistoryRoute() {
        //从数据库获取数据
        //如何知道这个用户的id
        //  console.log(getCookie('account'));
        //  console.log("这些类型的数量"+this.type);
        let route_type = 1;
        if (this.type === '1') {
          route_type = 1;
        } else if (this.type === '3') {
          route_type = 2;
        } else {
          route_type = 3;
        }
        let object = {ship_id: 5, route_type: route_type, flag: 1};
        findFlagAndType(object).then(res => {
          // console.log(res)
          if (res.code !== 200) {
            //console.log('发生错误');
            // console.log(res.data.message);
            this.$toast(res.data.message);
          } else {
            for (let i = 0; i < res.data.length; i++) {
              let temp = res.data[i];
              if (temp.flag === 1) {
                if (temp.route_type === 1 && this.type === '1') {//是巡航任务
                  this.historylist.push(temp);
                } else if (temp.route_type === 2 && this.type === '3') {//清洁任务
                  this.historylist.push(temp);
                } else if (temp.route_type === 3 && this.type === '2') {//水质任务
                  this.historylist.push(temp);
                }
              }
            }
            if (this.historylist.length === 0) {
              this.haveNoHistory = true;
            } else {
              this.historylist = res.data;
              this.historySelect = this.historylist[0];
              this.historyShow = true;
            }
            //  console.log('正确');
          }

        });

      },
      onTabbarIndex: function (title) {
        //   console.log(title);
        //    console.log('aaaaaaaaaaaaaaa');
      },
      Handler(name) {
        let operation = (name + "");
        if (operation === "标点") {
          this.fsign();
        } else if (operation === "撤销") {
          this.fdeleteOne();
        } else if (operation === "清除标点") {
          this.fclear();
        } else if (operation === "循环圈数") {
          this.fcricle();
        } else if (operation === "开始任务") {
          this.fstartTask();
        } else if (operation === "结束任务") {
          this.fendTask();
        } else if (operation === "暂停任务") {
          this.fstopTask();
        } else if (operation === "继续任务") {
          this.freStartTask();
        } else if (operation === "返航方式") {
          this.fbackmethod()
        } else if (operation === "开始返航") {
          this.fstartBack();
        } else if (operation === "结束返航") {
          this.fendBack();
        } else if (operation === "暂停返航") {
          this.fstopBack();
        } else if (operation === "继续返航") {
          this.freStartBack();
        } else if (operation === "检测时间") {
          this.fdetectionTime();
        } else if (operation === '保存路线') {
          this.fsaveRoute();
        } else if (operation === '清洁程度') {
          this.fcleanliness();
        } else if (operation === '路径标点') {
          this.frouteSign();
        } else if (operation === '区域标点') {
          this.fareaSign();
        } else if (operation === '结束标点') {
          this.fendSign();
        } else if (operation === '历史路径') {
          this.fhistoryRoute();
        }


      },
      SendCricleNum() {

        this.closeCricleShow();
        this.cricleNumToFather = this.cricleNum;
        this.showSuccessful = true;

      },
      closeCricleShow() {
        //one 代码巡航功能，two代表水质功能 ，three清洁功能
        this.cricleShow = false;
        if (this.type === "1") {
          //console.log("巡航");
          store.commit('cruiseShow', true);
        } else if (this.type === "2") {
          //  console.log("水质");
          store.commit('detectShow', true);
        } else if (this.type === "3") {
          //  console.log("清洁");
          store.commit('cleanShow', true);
        }
      },
      setSignMethod() {
        this.signMethodSelect = false;
        if (this.signMethod[0] === "路径点") {
          this.signMethodToFather = 3;
        } else if (this.signMethod[0] === "区域点") {
          this.signMethodToFather = 2;
        }
        store.commit('canSign', this.canSign);
        store.commit('signMethod', this.signMethodToFather);
        //this.showSuccessful = true;

      },
      closesignMethodSelect() {
        this.signMethodSelect = false;
      },
      closebackMethodSelect() {
        this.backMethodSelect = false;
      },
      setBackMethod() {
        this.backMethodSelect = false;
        this.backMethodToFather = this.backMethod[0];
        //console.log(this.backMethodToFather);
        this.showSuccessful = true;
      },
      closeTimeSelect() {
        this.timeSelect = false;
      },
      setTimeChange() {
        this.timeToFather = this.time;
        this.timeSelect = false;
        this.showSuccessful = true;
      },

      closeCleanShow() {
        this.cleanShow = false;
      },
      setCleanChange() {
        console.log("清洁选择" + this.cleanTofather);
        this.closeCleanShow();
        this.showSuccessful = true;
        //  console.log("清洁时间"+this.cleanTofather);
      },
      closeHistoryShow() {
        this.historyShow = false;
      },
      setHistorySelect() {
        //将获得的信息保存下来
        let object;
        if (this.type === '3') {
          object = {
            type: 3,
            route: this.historySelect.route.split('|')[0],
            area: this.historySelect.route.split('|')[1]
          };
        } else {
          object = {type: this.type, route: this.historySelect.route};
        }
        console.log(object);
        //将信息给周磊。
        this.$store.commit('historyRoute', object);
        console.log(this.historySelect);
        this.closeHistoryShow();
      },


      handleRoute(route) {
        let resultRoute = "";
        if (route.endsWith(';')) {
          route = route.substring(0, route.length - 1);
         // console.log("清理分号"+route);
        }
        if(this.cricleNumToFather+''==='1'){
          return route;
        }else{
          let split = route.split(";");
          if(split.length===1){//只有一个点
            for(let i=0;i<this.cricleNumToFather;i++){
              if(i!==this.cricleNumToFather-1){
                resultRoute += split[0]+";";
              }else{
                resultRoute += split[0];
              }
            }
          }else{
            let reverse = split.splice(1, split.length - 2).reverse().join(';');
            console.log(reverse);
            //循环圈数
            for (let i = 0; i < this.cricleNumToFather; i++) {
              if (i % 2 === 0) {
                //console.log("正");
               // resultRoute += route + ";";
                if(i!==this.cricleNumToFather-1){
                  resultRoute += route + ";";
                }else{
                  resultRoute += route;
                }
              } else if(i%2===1&&reverse!==""){
                resultRoute += reverse + ";";

              }
            }

            if (this.cricleNumToFather % 2 === 0) {
              resultRoute += split[0];
            }
            //resultRoute = resultRoute.substring(0, resultRoute.length - 1);
            //console.log("///////////////////////"+resultRoute+"////"+resultRoute.split(";").length);
            return resultRoute;
          }

        }

      },
      addOneRoute() {

        //   console.log("确认id是对的" + this.id);
        if (count++ > 5) {
          return;
        }
        setTimeout(() => {
          let areatemp = getReceive(this.id);
          //console.log("从庞长松那里拿到的数据" + this.root + areatemp);
          if (areatemp === undefined) {
            console.log("//////////////////");
            this.startNetError = true;
            this.tryAgain = true;
            return;
          }
          // console.log("距离"+getClean(this.id));
          let real_areatemp = this.handleRoute(areatemp);
          console.log(real_areatemp);
          //this.cricleNumToFather;
          this.tryAgain = false;
          let relRouter = this.root;

          addRoute({
            ship_id: 5,
            route: this.root + '|' + this.area,
            turns:this.cricleNumToFather,
            cleanliness:parseInt(this.cleanTofather),
            real_route:relRouter + real_areatemp,
            route_type:2
          }).then(res => {
            // console.log("res:====" + res.data);
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
          let lastTask = this.$store.getters.lastTask;
          lastTask[this.id] = {
            ship_id: 5,
            route: this.root + '|' + this.area,
            turns:1,
            cleanliness:parseInt(this.cleanliness),
            real_route:relRouter + areatemp,
            route_type:2
          };
          this.$store.commit("lastTask", lastTask);
          this.$store.commit('area',"");
          store.commit('root', "");
          setReceive(this.id, "");
        }, 1000);
      },
    },
    props: ['status', 'type', 'id'],
    watch: {
      status: function (val) {
        // console.log("prop变化了没有" + val);
      },
      height: function (newval) {
        //  console.log('触发改变高度');
        this.$emit('changeHeight', newval);
      },
      area(newval, oldval) {
        if (store.getters.shipChooseId + "" === (this.id + "")) {
          if (this.type === '3') {//清洁功能
              this.errorCode = -1;
              // let tempid = this.id;
            if(this.area!==""&&this.root!==""){
              sendAreaPoint(this.id, newval, this.root, this.cleanTofather);//将区域点进行处理，得到realroute。//将点拿去处理。

              this.addOneRoute();
            }
            }

          }

        //console.log('haaaaaa'+newval);

      },

      root(newval, oldval) {
        // console.log("我就看看这个类型到底是多少"+this.type);
        //就是说还要判断如何
        if (store.getters.shipChooseId + "" === (this.id + "") && newval !== "" && store.getters.cleanShow !== true) {
          if (this.type !== '3') {//当这个变量变化的时候还需要判断是不是这艘船在发生变化，
            // console.log("///////////////////////////////////"+this.type+"////"+this.id);
            let real_route = this.handleRoute(newval);//真实的路径let
            let id;
            //看看圈数的初始值
            // console.log(store.getters.detectShow);
            // console.log("类型"+this.type);
            if (store.getters.detectShow === true) {
              addRoute({
                ship_id: 5,
                route: newval,
                turns: this.cricleNumToFather,
                water_time: this.timeToFather,
                real_route: real_route,
                route_type: 3
              }).then(res => {
                console.log("res:====" + res.data);
                if (res.code !== 200) {
                  // this.$toast(res.data.message);
                  this.startError = true;
                  console.log("错误" + res.message);
                } else {//正确
                  id = res.data;
                  console.log("id:" + res.data);
                  start(id);//给船发指令
                  this.showToast = true;
                  //将最新的任务写进cookie里面

                }
              });
              let lastTask = this.$store.getters.lastTask;
              lastTask[this.id] = {
                ship_id: 5,
                route: newval,
                turns:1,
                water_time: this.timeToFather,
                real_route: newval.substring(0,newval.length-1),
                route_type: 3
              };
              this.$store.commit("lastTask", lastTask);

              store.commit('root', "");//将路径点置空
            } else if (store.getters.cruiseShow === true && this.type === '1') {//说明是巡航点
              console.log("执行巡航");
              //object = {ship_id: 5, route: newval, turns: this.cricleNumToFather, real_route: route, route_type: 1};
              addRoute({
                ship_id: 5,
                route: newval,
                turns: this.cricleNumToFather,
                water_time: this.timeToFather,
                real_route: real_route,
                route_type: 3
              }).then(res => {
                console.log(res);
                console.log("res:====" + res.data);
                if (res.code !== 200) {
                  // this.$toast(res.data.message);
                  this.startError = true;
                  console.log("错误" + res.message);
                } else {//正确
                  id = res.data;
                  console.log("id:" + res.data);
                  this.showToast = true;
                  start(id);//给船发指令
                }
              });

              let lastTask = this.$store.getters.lastTask;
              lastTask[this.id] = {
                ship_id: 5,
                route: newval,
                turns: 1,
                water_time: this.timeToFather,
                real_route: newval.substring(0,newval.length-1),
                route_type: 3
              };
              this.$store.commit("lastTask", lastTask);
            }
            store.commit('root', "");//将路径点置空


          }
        }

      },


    },
    components: {
      Grid,
      GridItem,
      TabbarItem,
      XButton,
      Popup,
      InlineXNumber,
      Selector,
      Group,
      Popover,
      Checklist,
      Picker,
      GroupTitle,
      Alert,
      Toast,
      Flexbox,
      FlexboxItem,
      Cell,
      ColorPicker,
      Checker,
      CheckerItem
    },
    directives: {
      TransferDom
    },
  }
</script>


<style lang="less" scoped>
  @import '~vux/src/styles/reset.less';

  .grid-center {
    display: block;
    text-align: center;
    color: #666;
  }

  .icon-grid .weui-grid {
    padding: 13px 10px;
  }

  .my-btn {
    width: 90%!important;
    margin-top: 5px!important;
    margin-bottom: 5px!important;
    position: relative!important;
    top: 0px !important;
    margin-left: 5%;
  }

  .my-btn2 {
    width: 80px !important;
    margin-left: 10px !important;
    margin-right: 10px !important;
  }

  .endSign-btn {
    width: 90%!important;
    margin-top: 5px!important;
    margin-bottom: 5px!important;
    position: relative!important;
    top: 0px !important;
    margin-left: 0px !important;
  }

  .my-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    background: url(../../static/img/xiangxia.png) no-repeat scroll right center transparent;
    padding-right: 16px;
    height: 30px;
    width: 100px;
    border: solid 2px #3b86c7;
    margin-top: 30px;


  }

  .my-select::-ms-expand {
    display: none;
  }

  .selectbox {
    margin-top: 30px;
    width: 200px;
    display: inline-block;
    overflow-x: hidden;
    height: 28px;
    line-height: 28px;
    font-size: 0;
    background: #fff url(../../static/img/xaingxia.png) right center no-repeat;
    border: 1px solid #dcdbdb;
    vertical-align: middle;
  }

  .selectbox select {
    cursor: pointer;
    padding: 0 8px;
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    width: 118%;
    padding-right: 18%;
    background: none;
    border: none;
  }

  .selectbox select option {
    padding: 5px;
    font-size: 14px;
  }


  .demo2-item {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
    margin-left: 15%;

  }

  .demo2-item-selected {
    border-color: #1296db;;
    background-color: #1296db;;
  }

  .mode {
    margin-left: 6vw;
    font-size: 3vw;
    margin-right: 6vw;
    margin-top: 15px;

  }

  .mode-name {
    /*   margin-left: 4.5vw;*/
    margin-left: 5vw;
    font-size: 4vw;
    margin-right: 5vw;
  }


</style>

<style lang="less" scoped>

  .popup {
    margin: 30px 50px 30px 50px;
    text-align: center;
  }

  .chargeRecordPage {
    font-family: Arial;
    color: black;
  }

  .chargeRecordPage /deep/ .weui-cells__title {
    font-size: 16px
  }

  .chargeRecordPage /deep/ .weui-cells {
    line-height: 1.21176471;
    font-size: 14px;
  }

  /* .chargeRecordPage /deep/ .weui--btn {
     line-height: 1.21176471;
     font-size: 14px;
   }*/

</style>
