<template>
  <div class="show-amap">
    <div id="show-amap-main"></div>
  </div>
</template>

<style lang="less" scoped>
  .show-amap {
    padding-top: 2vh;
  }
  #show-amap-main {
    width: 84vw;
    margin-left: 4vw;
    -webkit-appearance: none;
    height: 34vh;
    /*height: 33%;*/
    transform: translate3d(0,0,0);
    -moz-border-radius: 15px; /* Firefox */
    -webkit-border-radius: 15px; /* Safari 和 Chrome */
  }
</style>

<script>
  import {lazyAMapApiLoaderInstance} from 'vue-amap';
  import roadIcon from '../../static/img/1.png';
  import waterIcon from '../../static/img/2.png';
  import areaIcon from '../../static/img/3.png';
  import areaRoadIcon from '../../static/img/4.png';
  import {insertShipRoute} from '../api/api';
  import {findRouteById} from '../api/api';

  let map;//地图实例
  let polyline;//路径折线
  let path = [];//路径点
  let arealine;//区域未闭合前的直线
  let arealinePath = [];//区域未闭合时的点
  let cleanline;//清洁路线实例
  let cleanPath = [];//情节路线
  let polygon;//区域
  let areaPath = [];//区域点
  let boundary = []; //边界区域实例集合
  let obstacle = []; //障碍区域物实例集合
  let waterline = [];//水质线
  let waterPath = [];//水质点
  let routeLine;
  let routeLinePath = [];
  let copy = [];//临时保存数据的数组 要跨函数传参 所以定义全局
  let copy2 = [];//临时数组 因为copy 和copy2会同时用到所以定义俩个

  export default {
    name: "showMap",

    data() {
      return {
        markers: [],//路径点marker实例集合
        markersShip: [ ],//船标点实例
        markersWater: [],//水质点maeker实例集合
        markersArae: [],//区域点maeker实例集合
        markersAraeline: [],//未闭合区域点maeker实例集合
        markersClean: [],//清洁路线实例
        icon:null,
        activeTaskList: [],
        routeId: '',
        route: "",
      }
    },
    mounted() {


      lazyAMapApiLoaderInstance.load().then(() => {
        //初始化地图
        this.initMap();
        //初始化路径，清洁，区域等相关折线
        this.initPolyline();
      });
      this.routeId = this.message.routeId;
    },
    methods: {
      //初始化地图
      initMap(){
        map = new AMap.Map('show-amap-main', {
          resizeEnable: true, // 是否监控地图容器尺寸变化
          center: [108.898911, 34.247003], // 中心点坐标
          expandZoomRange: true, // 设置可扩展最大缩放级别
          zooms: [15, 20], // 设置地图级别范围
          zoom: 17, // 级别
          layers: [ // 使用多个图层
            new AMap.TileLayer.Satellite(),
            new AMap.TileLayer.RoadNet()
          ],
        });
        map.on('click', this.addMarker);
        map.on('mouseover', this.openMapClick);
      },

      //初始化图标
      initIcon(){
        if (this.pointType === 0){
          this.icon = new AMap.Icon({
            image: roadIcon,
            imageSize: new AMap.Size(18, 18),
          })
        }else if (this.pointType === 1){
          this.icon = new AMap.Icon({
            image: waterIcon,
            imageSize: new AMap.Size(18, 18),
          })
        }else if (this.pointType === 2){
          this.icon = new AMap.Icon({
            image: areaIcon,
            imageSize: new AMap.Size(18, 18),
          })
        }else if (this.pointType === 3){
          this.icon = new AMap.Icon({
            image: areaRoadIcon,
            imageSize: new AMap.Size(18, 18),
          })
        }
      },


      //初始化所有折线
      initPolyline(){
        polyline = new AMap.Polyline({
          path: path,
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#61f7f7', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        });
        polyline.setMap(map);

        // waterline = new AMap.Polyline({
        //   path: path,
        //   borderWeight: 2, // 线条宽度，默认为 1
        //   strokeColor: '#d38fff', // 线条颜色
        //   lineJoin: 'round' // 折线拐点连接处样式
        // });
        // waterline.setMap(map);

        // arealine = new AMap.Polyline({
        //   path: arealinePath,
        //   borderWeight: 2, // 线条宽度，默认为 1
        //   strokeColor: '#61f7f7', // 线条颜色
        //   lineJoin: 'round' // 折线拐点连接处样式
        // });
        // arealine.setMap(map);

        // cleanline = new AMap.Polyline({
        //   path: cleanPath,
        //   borderWeight: 2, // 线条宽度，默认为 1
        //   strokeColor: '#fff764', // 线条颜色
        //   lineJoin: 'round' // 折线拐点连接处样式
        // });
        // cleanline.setMap(map);

        // routeLine = new AMap.Polyline({
        //   path: routeLinePath,
        //   borderWeight: 2, // 线条宽度，默认为 1
        //   strokeColor: '#fed90c', // 线条颜色
        //   lineJoin: 'round' // 折线拐点连接处样式
        // })
        // routeLine.setMap(map);
      },
      // messages() {
      //   this.routeId = this.message.routeId;
      // }

    },
    computed: {

    },
    watch: {
      'message': (newData, oldData) => {
        // this.routeId = newData;
        findRouteById({id: newData}).then(res => {
          if (res.data.code === 200) {
            this.route = res.data.data.route
            path = []
            let temp = this.route.split(";")
            temp.pop()
            this.icon = new AMap.Icon({
              image: roadIcon,
              imageSize: new AMap.Size(12, 12),
            })
            for(let i in this.markers){
              this.markers[i].setMap(null);
            }
            this.markers = []
            for (let i in temp){
              let x = parseFloat(temp[i].split(",")[1])
              let y = parseFloat(temp[i].split(",")[0])
              let marker = new AMap.Marker({
                icon: this.icon,
                map: map,
                position: [x,y],
                draggable: false,
                bubble: true,
                offset:new AMap.Pixel(-6, -6),
              });
              this.markers.push(marker);//路径点压入markers实例数组
              path.push([x,y])
            }
            polyline.setPath(path)
            polyline.setMap(map)
            map.setCenter(path[0]);
          }
        })
      }
    },

    props: {
      message:{
        type: String,
        default: {routeId: "0",}
      }
    },
  }
</script>
