import {getCookie} from "./cookie";
import {setCookie} from "./cookie";
import {changeState} from "./cookie";
import variable from './global/variable'
import store from '../store'

let webSocket = null;
let global_callback = null;
let send = null;
let receive = [];
let distant = [];
let saveTime=[];
// 发送的指令
const stopM = '$B;0#';
const recoverM = '$B;1#';
const endM = '$B;2#';
const backM = '$C;#';
let flag = [0,0,0,0,0,0,0,0];
let root = "108.898616,34.247292;";
let test = "108.898583,34.24721;108.898549,34.247125;108.898652,34.247103;108.89852,34.247055;108.898601,34.246977;108.898663,34.247035;108.898741,34.246944;108.898851,34.247049;108.898746,34.247088;108.898869,34.247199;108.898811,34.247264;108.898717,34.247273;108.89869,34.247149;108.898583,34.24721;";


function initWebSocket() {
  webSocket = new WebSocket('ws://vps.orca-tech.cn:9001');
  webSocket.onmessage = function (e) {//接收消息
    socketMessage(e);
  };
  webSocket.onclose = function () {
    socketClose();
  };
  webSocket.onopen = function () {
    console.log("建立链接");
    socketOpen();
  };
  webSocket.onerror = function () {
    this.$vux.toast.text('socket连接发生错误！');
    setTimeout(function () {
      initWebSocket();
    }, 1000);
    // this.$toast();
  }
}

// 实际调用的方法
function sendSocket(agentData, callback) {
  global_callback = callback;
  if (webSocket.readyState === webSocket.OPEN) {
    // 若是socket开启状态
    socketSend(agentData);
  } else if (webSocket.readyState === webSocket.CONNECTING) {
    // 若是正在开启状态，则等待1s后重新调用
    setTimeout(function () {
      sendSocket(agentData, callback);
    }, 1000);
  } else {
    // 若未开启，则等待1s后重新调用
    setTimeout(function () {
      sendSocket(agentData, callback);
    }, 1000);
  }
  // console.log("打印的回调"+global_callback);
}
//用来检测当前船是否掉电
function checkShip(){
  setTimeout(()=>{

    }
  );
}
/*
发送区域点
data 是一个对象数组
 */
function sendAreaPoint(id, area, route, clean) {
  let points = route.split(";");
  let lastPoint = points[points.length - 2];
  let data = "&lnglat;" + area + lastPoint + ";" + clean + ";" + id + "#";
  console.log("处理点");
  sendSocket(data);
}

function getReceive(id) {
  return receive[id];
}

function setReceive(id, data) {
  receive[id] = data;
}

function getDistant(id) {
  return distant[id];
}

function setDistant(id, data) {
  distant[id] = data;
}

function start(id) {
  let data = '$A;' + id + '#';
  sendSocket(data);
}

function changeShip(id) {
  //console.log("在这里执行换船");
  let data = '&id' + ';' + id + '#';
  sendSocket(data);
}

function end() {
  sendSocket(endM);
}

function back() {
  sendSocket(backM);
}

function stop() {
  sendSocket(stopM);
}

function recover() {
  sendSocket(recoverM);
}


function rechange(data) {
  console.log("接收到的数据" + data);
  let id = parseInt(data[data.length - 2]);
  data = data.substring(8, data.length - 3);
  console.log(data + "////" + data.split(";").length);
  let index = find(data, ';', data.split(";").length - 1);//最后一个 ； 的下标
  receive[id] = data.substring(0, index - 1);
  distant[id] = data.substring(index + 1, data.length - 1);
}

// 数据接收
function socketMessage(e) {
  if (e.data.indexOf('&lnglat') === 0) {
    //console.log('这里执行了吗');
    rechange(e.data);
    //console.log("1111111"+receive);
  } else {
    let topic = e.data.split(';')[0];
    let msg = e.data.split(';')[1];

    let user = topic.split("/")[1];
    let ship = topic.split("/")[2];
    let topicContent = topic.split("/")[3];//当前的主题名
 /*   saveTime[ship] =*/
    if (topicContent === "BASIC") { // if(getCookie('account')===data.ship_id){//用户对不
      let data = JSON.parse(msg);
      //更新所有的变量。
      //console.log("这里的flag："+flag[ship]);
      let temp = store.getters.curr_state;
      if (data.state === -3&&flag[ship]+''==='0') {//让船知道任务结束
        flag[ship]=1;
        store.commit('finishTofuthree', ship);
        console.log("....." + store.getters.finishTofuthree);
      }else if(data.state===0){
        flag[ship]=0;
      }
      if (temp[ship] !== data.state) {
        if (data.state === 0) {
          store.commit('finishTaskShip', ship);
        }

        temp.splice(ship, 1, data.state);
        store.commit("curr_state", temp);
      }
      temp = store.getters.curr_lat;
      if (temp[ship] !== data.lat) {
        temp.splice(ship, 1, data.lat);
        store.commit("curr_lat", temp);
      }

      temp = store.getters.curr_lng;
      if (temp[ship] !== data.lng) {
        temp.splice(ship, 1, data.lng);
        store.commit("curr_lng", temp);
      }
      temp = store.getters.curr_yaw;
      if (temp[ship] !== data.yaw) {
        temp.splice(ship, 1, data.yaw);
        store.commit("curr_yaw", temp);
      }
      temp = store.getters.curr_battle;
      if (temp[ship] !== data.pd_current) {
        temp.splice(ship, 1, data.pd_current);
        store.commit("curr_battle", temp);
      }
       temp = store.getters.curr_speed;
     // console.log(data.speed);
      if (temp[ship] !== data.speed) {
        temp.splice(ship, 1, data.speed);
        store.commit("curr_speed", temp);
      }

      temp = store.getters.rame_time;
      if (temp[ship] !== data.pd_rematime) {
        temp.splice(ship, 1, data.pd_rematime);
        store.commit("rame_time", temp);
      }
      temp = store.getters.curr_percen;
      if (temp[ship] !== data.pd_percent) {
        temp.splice(ship, 1, data.pd_percent);
        store.commit("curr_percen", temp);
      }
    }
  }


}

// 数据发送
function socketSend(e) {
  webSocket.send(e);
}

// 关闭
function socketClose() {
  // this.$toast('请检查网络，与服务器的连接已断开！');
}

// 打开
function socketOpen() {//就是说当前用户的信息是保存在cookie里面的

  socketSend('&ship_id;' + 5 + '#');
  socketSend('&total_ship;' + 5 + '#');
}

function find(str, cha, num) {

  var x = str.indexOf(cha);
  for (var i = 1; i < num; i++) {
    x = str.indexOf(cha, x + 1);
    if (x === -1) {
      break;
    }
    // console.log("00"+x);
  }
  return x;
}




//在这里面写发送的请求：
//直接发命令就行了，但还得写到数据库里面

initWebSocket();

//sendAreaPoint(5,test,root,3);
//sendSocket(data);
//sendAreaPoint(data);
// rechange(data);
// sendAreaPoint(data);
export {
  sendSocket,
  start,
  end,
  stop,
  recover,
  back,
  changeShip,
  sendAreaPoint,
  getReceive,
  setReceive,
}
