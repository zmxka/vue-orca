export default {

  pointLabelType: '',
  wqNumber: 0,
  allBorder: [],
  allBorderList: [],
  allBarrier: [],
  allBarrierList: [],
  allWaterMarker: [],
  allRouteMarker: [],
  allRouteMarkerPosition: [],
  allRouteMarkerBorderPosition: [],
  allRouteMarkerBarrierPosition: [],
  allRouteMarkerLngLat: [],

  canSign:0,
  signMethod:0,
  state:'0',
  //有问题，是因为这个数据是每一个都要变化，切回去的时候我的变量应该如何变化。
  //如何将数据传进去//如何将数据传进去？？？？

//   var $j = jQuery.noConflict();
// var pointLabelType = "";
// var ec = "";
// var waterRouteId = "";
// var temper = "";
// var pointType = 0;
// var wqNumber = 0;
// var wqNumberCurr = 0;
// var socket;
// var isSpeed = 0;
// var isRouteInWindow = 0;
// var id = -1;
// var position = 0;
// var flagTrack = 0;
// var allWaterMarker = new Array();
// var sendSpeed = new Array();
// var track = new Array();                                            //开始导航时当前发送的目标点数
// var allRouteMarker = new Array();
// var allRouteMarkerPosition = new Array();
// var allRouteMarkerBorderPosition = new Array();
// var allRouteMarkerBarrierPosition = new Array();
// var allRouteMarkerLngLat = new Array();
// var shipid = Cookies.get("ship_id");
// var totalship = Cookies.get("total_ship");
// var allShipLng = new Array();                                       //经度
// var allShipLat = new Array();                                       //纬度
// var allShipName = new Array();
// var allShipYaw = new Array();
// var allShipState = new Array();
// var allShipPercen = new Array();
// var allShipRemaTime = new Array();
// var allShipCurrStr = new Array();
// var allShipSpeed = new Array();
// var allShipStars = new Array();
// var allShipTime = new Array();
// var allShipMarker = new Array();
// var allBorder = new Array();
// var allBarrier = new Array();
// var allBorderList = new Array();
// var allBarrierList = new Array();
// var startTime = "";
// var endTime = "";
// var sendFlag = 0;
// var shipState = 0;

  setPointLabelType (type) {
    this.pointLabelType += type;
  },
  setWqNumber () {
    this.wqNumber++;
  },
  setAllBorder (border) {
    this.allBorder.push(border);
  },
  setAllBorderList (routeBorder) {
    this.allBorderList.push(routeBorder);
  },
  setAllBarrier (border) {
    this.allBarrier.push(border);
  },
  setAllBarrierList (polygon) {
    this.allBarrierList.push(polygon);
  },
  setAllWaterMarker (id, marker) {
    this.allWaterMarker[id].push(marker);
  },
  setAllRouteMarker (id, marker) {
    this.allRouteMarker[id].push(marker);
  },
  setAllRouteMarkerPosition (id, lngLat) {
    this.allRouteMarkerPosition[id].push(lngLat);
  },
  setCanSign(sign){
    console.log("改变全局变量");
    this.canSign = sign;
  },
  // setSignMethod(signMethod){
  //   console.log("改变全局变量");
  //   this.signMethod = signMethod;
  // },
  setState(value){
    this.state = value;
   // this.$store.commit("curr_state",value);
  }

}
