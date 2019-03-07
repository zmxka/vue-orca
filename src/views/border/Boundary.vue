<template>
<div class="amap">
  <div id="amap-main" ></div>
  <div id="Console">
    <span class="consoleLabel">边界设置</span>
    <InlineXSwitch :value-map="[0,1]" v-model="pointValue"></InlineXSwitch>
    <span class="consoleLabel">障碍设置</span><br/>
    <grid>
      <grid-item label="标点" @on-item-click="isSign">
        <img slot="icon" src="../../../static/img/add/1.png" alt="">
      </grid-item>
      <grid-item label="撤销"  @on-item-click="cliclCancel">
        <img slot="icon" src="../../../static/img/clean/cancelSelected.png" alt="">
      </grid-item>
      <grid-item label="删除" @on-item-click="clickDelete">
        <img slot="icon" src="../../../static/img/clean/clearSelected.png" id="deleteIcon" alt="">
      </grid-item>
    </grid>
    <x-button class="queren" type="primary" @click.native="saveBoundaryAndObstacle">设定</x-button>
  </div>
</div>
</template>
<style lang="less" scoped>
  #amap-main {
    width: 94vw !important;
    margin-left: 3vw !important;
    -webkit-appearance: none !important;
    height: 90vh !important;
    transform: translate3d(0,0,0) !important;
    -moz-border-radius: 15px; /* Firefox */
    -webkit-border-radius: 15px; /* Safari 和 Chrome */
  }
  #Console{
    background-color: #ffffff;
    width: 90vw !important;
    margin-left: 5vw !important;
    -webkit-appearance: none !important;
    height: 32vh !important;
    transform: translate3d(0,0,0) !important;
    -moz-border-radius: 5px; /* Firefox */
    -webkit-border-radius: 5px; /* Safari 和 Chrome */
    position: absolute;
    bottom: 0;
  }

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

  .queren {
    top: 1vh;
    margin-left: 15vw;
    width: 60vw;
  }

  .consoleLabel{
    position: relative;
    bottom: 1vh;
    font-size: 4vw;
    margin-left: 10vw;
    margin-right: 10vw;
  }
</style>

<script>
  import {lazyAMapApiLoaderInstance} from 'vue-amap';
  import roadIcon from '../../../static/img/1.png';
  import waterIcon from '../../../static/img/2.png';
  import deleteIcon from '../../../static/img/clean/clearSelected.png'
  import deleteIcon2 from '../../../static/img/add/1.png'
  import {insertShipRoute,getBoundaryAndObstacles,setBoundaryAndObstacles,delBoundaryAndObstacles} from '../../api/api';
  import { XButton,Group,XSwitch,InlineXSwitch  } from 'vux';
  import { Grid, GridItem } from 'vux'

  let map;//地图实例
  let boundaryArae;//区域闭合
  let obstacleArea;//障碍闭合
  let boundaryline;//区域未闭合的直线
  let obstacleline;//障碍未闭合的直线
  let boundary = []; //边界区域实例集合
  let obstacle = []; //障碍区域物实例集合
  let boundaryPath = [];//区域点
  let obstaclePath = [];//障碍点
  let boundarylinePath = [];//区域未闭合时的点
  let obstaclelinePath = [];//区域未闭合时的点
  let copy = [];//临时保存数据的数组
  let copy2 = [];//
  let copy3 = [];
  export default {
    props: ['msg'],
    data() {
      return {
        markersBoundary: [],//区域点maeker实例集合
        markersBoundaryline :[],
        markersObstacle: [],//区域点maeker实例集合
        markersObstacleline :[],
        boundarySign: 0,//区域是否闭合 0未闭合 1 闭合
        obstacleSign: 0,
        icon:null,
        pointValue: 0,
        isCancelValue: -1,//撤销标识
        isdelete: 0,//删除标识
        tem:0,
      }
    },
    mounted() {
      lazyAMapApiLoaderInstance.load().then(() => {
        this.initVariable();
        //初始化地图
        this.initMap();
        //初始化区域相关折线
        this.initPolyline();
        //初始化边界
        this.initBoundaryAndObstacles();
        this.initIcon();
      });
    },
    methods: {
      initVariable(){
        map = null;
        boundaryArae = null;
        obstacleArea = null;
        boundaryline = null;
        obstacleline = null;
        boundary = [];
        obstacle = [];
        boundaryPath = [];
        obstaclePath = [];
        boundarylinePath = [];
        obstaclelinePath = [];
        copy = [];
        copy2 = [];
        copy3 = [];
      },
      //初始化地图
      initMap(){
        map = new AMap.Map('amap-main', {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        center: [108.898352, 34.24743], // 中心点坐标
        expandZoomRange: true, // 设置可扩展最大缩放级别
        zooms: [15, 20], // 设置地图级别范围
        zoom: 18, // 级别
      });
        var layer = [
          new AMap.TileLayer.Satellite(),
        ];
        layer[0].setTileUrl('http://mt{1,2,3,0}.google.cn/vt/lyrs=s@821&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil');
        map.setLayers(layer);
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
        }
      },
      //初始化边界障碍
      initBoundaryAndObstacles(){
        var lnglat;
        var boundspath = [];
        for (var i = 0; i < this.bounds.length; i++) {
          boundspath[i] = new Array();
          for (var j = 0; j < this.bounds[i].length; j++) {
            lnglat = new AMap.LngLat(this.bounds[i][j][0], this.bounds[i][j][1]);
            boundspath[i][j] = lnglat;
          }
          boundary[i] = new AMap.Polygon({
            path: boundspath[i],
            fillColor: '#f4a762', // 多边形填充颜色
            fillOpacity: 0,//多边形透明度
            borderWeight: 2, // 线条宽度，默认为 1
            strokeColor: '#f4a762', // 线条颜色
            bubble: true,
            extData:'B'+i,
          });
          boundary[i].on('click',this.deleteBO);
          map.add(boundary[i]);//添加多边形
        }
        //初始化障碍
        for (var i = 0; i < this.obstacles.length; i++) {
          boundspath[i] = new Array();
          for (var j = 0; j < this.obstacles[i].length; j++) {
            lnglat = new AMap.LngLat(this.obstacles[i][j][0], this.obstacles[i][j][1]);
            boundspath[i][j] = lnglat;
          }
          obstacle[i] = new AMap.Polygon({
            path: boundspath[i],
            fillColor: '#ff3d3e', // 多边形填充颜色
            fillOpacity: 0.5,//多边形透明度
            borderWeight: 2, // 线条宽度，默认为 1
            strokeColor: '#ff3d3e', // 线条颜色
            bubble: true,
            extData:'O'+i,
          });
          obstacle[i].on('click',this.deleteBO);
          map.add(obstacle[i]);//添加多边形
        }
      },
      //初始化所有折线
      initPolyline(){
        boundaryline = new AMap.Polyline({
          path: boundarylinePath,
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#61f7f7', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        });
        boundaryline.setMap(map);
        obstacleline= new AMap.Polyline({
          path: obstaclelinePath,
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#61f7f7', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        });
        obstacleline.setMap(map);
      },
      //点击地图标点
      addMarker(e) {
        if (this.pointType !== 0 && this.pointType !== 1 ) return;
        //console.log(e.lnglat);
        var pointType = this.pointType;
        let marker;
        if (pointType === 0) {  //边界
          marker = new AMap.Marker({
            icon: this.icon,
            map: map,
            position: e.lnglat,
            offset:new AMap.Pixel(-10, -10),
            draggable: true,
            bubble: false,
            extData: pointType,
          });
          //console.log(polyline.getPath());
          this.markersBoundaryline.push(marker);
          //this.markersArae.push(marker);
          boundarylinePath.push(e.lnglat);
          //areaPath.push(e.lnglat);
          boundaryline.setPath(boundarylinePath);
          boundaryline.setMap(map);
          marker.on('click', this.addArea);
         // marker.on('mousemove', this.afterAddArea);
          marker.on('dragging', this.moveMarker);
          // marker.on('mousedown', this.getLngLat);
          // marker.on('dragend', this.afterDrag);
          // marker.on('touchstart', this.getLngLat);
        } else if (pointType === 1) {  //障碍
          marker = new AMap.Marker({
            icon: this.icon,
            map: map,
            position: e.lnglat,
            offset:new AMap.Pixel(-10, -10),
            draggable: true,
            bubble: false,
            extData: pointType,
          });
          //console.log(polyline.getPath());
          this.markersObstacleline.push(marker);
          //this.markersArae.push(marker);
          obstaclelinePath.push(e.lnglat);
          //areaPath.push(e.lnglat);
          obstacleline.setPath(obstaclelinePath);
          obstacleline.setMap(map);
          marker.on('click', this.addArea);
         // marker.on('mousemove', this.afterAddArea);
          marker.on('dragging', this.moveMarker);
          // marker.on('mousedown', this.getLngLat);
          // marker.on('dragend', this.afterDrag);
          // marker.on('touchstart', this.getLngLat);
        }
      },
      //移动标记
      moveMarker(e) {
        var flag = e.target.getExtData();
        if (flag === 0) {   //边界移动
          if (this.boundarySign === 0) {
            boundarylinePath.length = 0;
            var lnglat;
            for (var i = 0; i < this.markersBoundaryline.length; i++) {
              lnglat = new AMap.LngLat(this.markersBoundaryline[i].getPosition().getLng(), this.markersBoundaryline[i].getPosition().getLat());
              boundarylinePath.push(lnglat);
            }
            boundaryline.setPath(boundarylinePath);
            boundaryline.setMap(map);
          } else if (this.boundarySign === 1) {
            boundaryPath.length = 0;
            var lnglat;
            for (var i = 0; i < this.markersBoundary.length; i++) {
              lnglat = new AMap.LngLat(this.markersBoundary[i].getPosition().getLng(), this.markersBoundary[i].getPosition().getLat());
              boundaryPath.push(lnglat);
            }
            boundaryArae.setPath(boundaryPath);
            boundaryArae.setMap(map);
          }
        }  else if (flag === 1) {  //障碍移动
          if (this.obstacleSign === 0) {
            obstaclelinePath.length = 0;
            var lnglat;
            for (var i = 0; i < this.markersObstacleline.length; i++) {
              lnglat = new AMap.LngLat(this.markersObstacleline[i].getPosition().getLng(), this.markersObstacleline[i].getPosition().getLat());
              obstaclelinePath.push(lnglat);
            }
            obstacleline.setPath(obstaclelinePath);
            obstacleline.setMap(map);
          } else if (this.obstacleSign === 1) {
            obstaclePath.length = 0;
            var lnglat;
            for (var i = 0; i < this.markersObstacle.length; i++) {
              lnglat = new AMap.LngLat(this.markersObstacle[i].getPosition().getLng(), this.markersObstacle[i].getPosition().getLat());
              obstaclePath.push(lnglat);
            }
            obstacleArea.setPath(obstaclePath);
            obstacleArea.setMap(map);
          }
        }
      },
      addArea(e) {
          if (this.pointType === 0) {
            if (this.markersBoundaryline[0].getPosition() === e.target.getPosition()) {
              map.off('click', this.addMarker);
              this.boundarySign = 1;
              this.markersBoundary = this.markersBoundaryline.slice(0);
              boundaryPath = boundarylinePath.slice(0);
              boundaryArae = new AMap.Polygon({
                path: boundaryPath,
                fillColor: '#f4a762', // 多边形填充颜色
                fillOpacity: 0,//多边形透明度
                borderWeight: 2, // 线条宽度，默认为 1
                strokeColor: '#f4a762', // 线条颜色
              });
              map.add(boundaryArae);//添加多边形
              map.remove(boundaryline);//移除未闭合时路径线
              copy = this.markersBoundaryline.slice(0);//保存所有路劲点实例下边删除可用
              //console.log(copy);
              this.markersBoundaryline.length = 0;
              boundarylinePath.length = 0;
              //console.log('路径点'+polyline.getPath())
            }
          }else if (this.pointType === 1) {
            if (this.markersObstacleline[0].getPosition() === e.target.getPosition()) {
              map.off('click', this.addMarker);
              this.obstacleSign = 1;
              this.markersObstacle = this.markersObstacleline.slice(0);
              obstaclePath = obstaclelinePath.slice(0);
              obstacleArea = new AMap.Polygon({
                path: obstaclePath,
                fillColor: '#ff3d3e', // 多边形填充颜色
                fillOpacity: 0.5,//多边形透明度
                borderWeight: 2, // 线条宽度，默认为 1
                strokeColor: '#ff3d3e', // 线条颜色
              });
              map.add(obstacleArea);//添加多边形
              map.remove(obstacleline);//移除未闭合时路径线
              copy3 = this.markersObstacleline.slice(0);//保存所有路劲点实例下边删除可用
              //console.log(copy);
              this.markersObstacleline.length = 0;
              obstaclelinePath.length = 0;
              //console.log('路径点'+polyline.getPath())
            }
          }
      },
      //构造输出数据
      constructorData(){
        var boundaryData = '';//边界 latlng flag
        var obstacleData = '';//障碍
        let data = {};
        if (this.pointType === 0) {
          if(this.boundarySign === 1){
            boundaryArae.setExtData('B'+boundary.length);
            boundaryArae.on('click',this.deleteBO);
            boundary.push(boundaryArae);
            for (var i=0;i<this.markersBoundary.length;i++){
              boundaryData = boundaryData+this.markersBoundary[i].getPosition().getLng() + ',' + this.markersBoundary[i].getPosition().getLat() + ';';
            }
              boundaryData = 'b'+';'+boundaryData;
            setBoundaryAndObstacles({shipId: 5,latlng: boundaryData,flag: 1}).then(res => {
                if (res.code === 200){
                  console.log('chacheng')
                }else {
                  console.log('cuowu')
                }
              }
            );
            map.remove(this.markersBoundary);
            boundaryPath.length = 0;
            this.markersBoundary.length = 0;
            copy.length = 0;
            this.boundarySign = 0;
            map.on('click', this.addMarker);
          } else if (this.boundarySign === 0){
            if (this.markersBoundaryline.length !== 0){
              console.log("请闭合边界");
              return;
            }else {
              console.log("边界不能为空");
              return;
            }
          }
        }else if (this.pointType ===1){
          if (this.obstacleSign === 1){
            obstacleArea.setExtData('O'+obstacle.length);
            obstacleArea.on('click',this.deleteBO);
            obstacle.push(obstacleArea);
            for (var i=0;i<this.markersObstacle.length;i++) {
              obstacleData = obstacleData + this.markersObstacle[i].getPosition().getLng() + ',' + this.markersObstacle[i].getPosition().getLat() + ';';
            }
            obstacleData = 'o'+';'+obstacleData;
            setBoundaryAndObstacles({shipId: 5,latlng: obstacleData,flag: 2}).then(res => {
              if (res.code === 200){
                console.log('chacheng')
              }else {
                console.log('cuowu')
              }
            });
            map.remove(this.markersObstacle);
            obstaclePath.length = 0;
            this.markersObstacle.length = 0;
            copy3.length = 0;
            this.obstacleSign = 0;
            map.on('click', this.addMarker);
          }else if (this.obstacleSign === 0){
            if (this.markersObstacleline.length !==0){
              console.log("请闭合障碍");
              return;
            }else {
              return;
            }
          }
        }
      },
      //点击撤销
      cliclCancel(){
        if (this.boundarySign ===0&&this.obstacleSign ===0){
          this.isCancelValue = 1+2*this.tem;
          this.tem++;
        } else {
          this.isCancelValue = 2*this.tem;
          this.tem++;
        }
      },
      //点击删除
      clickDelete(){
        if (document.getElementById('deleteIcon').src === deleteIcon){
          document.getElementById('deleteIcon').src = deleteIcon2;
          map.off('click', this.addMarker);
          this.isdelete = 1;
        }else if (document.getElementById('deleteIcon').src === deleteIcon2) {
          document.getElementById('deleteIcon').src = deleteIcon;
          map.on('click', this.addMarker);
          this.isdelete = 0;
        }
      },
      //删除处理
      deleteBO(e){
        if (this.isdelete === 1) {
          var pathData = '';
          for(var i =0; i< e.target.getPath().length;i++ ){
            pathData = pathData+ e.target.getPath()[i].lng+','+e.target.getPath()[i].lat+';';
          }
          var type = e.target.getExtData().charAt(0);
          var index = parseFloat(e.target.getExtData().charAt(1));
          if (type === 'B'){
            boundary[index].setMap(null);
            delete boundary[index];
            pathData = 'b'+';'+pathData;
            delBoundaryAndObstacles({shipId: 5,latlng: pathData,flag: 1}).then(res => {
              if (res.code === 200){
                console.log('chachengdddd')
              }else {
                console.log('cuowu')
              }
            });
          }else if (type === 'O'){
            obstacle[index].setMap(null);
            delete obstacle[index];
            pathData = 'o'+';'+pathData;
            delBoundaryAndObstacles({shipId: 5,latlng: pathData,flag: 2}).then(res => {
              if (res.code === 200){
                console.log('chacheng')
              }else {
                console.log('cuowu')
              }
            });
          }
        }else {
          return;
        }
      },
      //保存处理
      saveBoundaryAndObstacle(){
        this.constructorData();
      },
      //标点控制
      isSign(){
        map.on('click', this.addMarker);
      }
    },
    computed: {
      pointType(){
        return parseFloat(this.pointValue);
      },
      isdel() {
        return this.isCancelValue;
      },
      bounds(){
        let lnglat = [];
        let tem;
        let j = 0;
        for (let i= 0;i<this.$store.getters.boundsAndObstacles.length;i++){
          tem = this.$store.getters.boundsAndObstacles[i].split(';');
          if (tem[0] === 'b'){
            tem = tem.slice(1,tem.length-1);
            lnglat[j] = tem;
            j++;
          }
        }
        for (let i=0;i<j;i++){
          for (let k=0;k<lnglat[i].length;k++){
            lnglat[i][k] = lnglat[i][k].split(',');
            lnglat[i][k][0] = parseFloat(lnglat[i][k][0]);
            lnglat[i][k][1] = parseFloat(lnglat[i][k][1]);
          }
        }
        return lnglat;
      },
      obstacles(){
        let lnglat = [];
        let tem;
        let j = 0;
        for (let i= 0;i<this.$store.getters.boundsAndObstacles.length;i++){
          tem = this.$store.getters.boundsAndObstacles[i].split(';');
          if (tem[0] === 'o'){
            tem = tem.slice(1,tem.length-1);
            lnglat[j] = tem;
            j++;
          }
        }
        for (let i=0;i<j;i++){
          for (let k=0;k<lnglat[i].length;k++){
            lnglat[i][k] = lnglat[i][k].split(',');
            lnglat[i][k][0] = parseFloat(lnglat[i][k][0]);
            lnglat[i][k][1] = parseFloat(lnglat[i][k][1]);
          }
        }
        return lnglat;
      },
    },
    watch: {
        //监听类型变化
      pointType(newType, oldType) {
        if(newType !== -1){
          this.initIcon();
        }
        if(newType === 0){
          if (this.markersObstacleline.length === 0 && this.markersObstacle.length === 0) return;
          if (this.obstacleSign === 0) {
            map.remove(obstacleline);
            map.remove(this.markersObstacleline);
            this.markersObstacleline.length = 0;
            obstaclelinePath.length = 0;
          } else if (this.obstacleSign === 1) {
            console.log();
            map.remove(obstacleArea);
            map.remove(this.markersObstacle);
            obstaclePath.length = 0;
            this.markersObstacle.length = 0;
            copy3.length = 0;
            this.obstacleSign = 0;
            map.on('click', this.addMarker)
          }
        }else if (newType === 1){
          if (this.markersBoundaryline.length === 0 && this.markersBoundary.length === 0) return;
          if (this.boundarySign === 0) {
            map.remove(boundaryline);
            map.remove(this.markersBoundaryline);
            this.markersBoundaryline.length = 0;
            boundarylinePath.length = 0;
          } else if (this.boundarySign === 1) {
            map.remove(boundaryArae);
            map.remove(this.markersBoundary);
            boundaryPath.length = 0;
            this.markersBoundary.length = 0;
            copy.length = 0;
            this.boundarySign = 0;
            map.on('click', this.addMarker)
          }
        }
      },
      //监听删除
      isdel(newIs, oldIs) {
        //等于1撤销
        if (newIs % 2 === 1) {
          map.on('click', this.addMarker);
          if (this.pointType === 0) {
            if (this.markersBoundaryline.length === 0 && this.markersBoundary.length === 0) return;
            if (this.boundarySign === 1) {
              map.remove(boundaryArae);
              map.remove(this.markersBoundary);
              boundaryPath.length = 0;
              this.markersBoundary.length = 0;
              copy.length = 0;
              this.boundarySign = 0;
            } else {
              this.markersBoundaryline[this.markersBoundaryline.length - 1].setMap(null);
              this.markersBoundaryline.pop();
              //this.markersArae.pop();
              //areaPath.pop();
              boundarylinePath.pop();
              boundaryline.setPath(boundarylinePath);
              boundaryline.setMap(map);
            }
          } else if (this.pointType === 1) {
            if (this.markersObstacleline.length === 0 && this.markersObstacle.length === 0) return;
            if (this.obstacleSign === 1) {
              map.remove(obstacleArea);
              map.remove(this.markersObstacle);
              obstaclePath.length = 0;
              this.markersObstacle.length = 0;
              copy3.length = 0;
              this.obstacleSign = 0;
            } else {
              this.markersObstacleline[this.markersObstacleline.length - 1].setMap(null);
              this.markersObstacleline.pop();
              //this.markersArae.pop();
              //areaPath.pop();
              obstaclelinePath.pop();
              obstacleline.setPath(obstaclelinePath);
              obstacleline.setMap(map);
            }
          }
        } else if (newIs % 2 === 0) {  //等于0全部删除
          if (this.pointType === 0) {
            if (this.markersBoundaryline.length === 0 && this.markersBoundary.length === 0) return;
            if (this.boundarySign === 0) {
              map.remove(boundaryline);
              map.remove(this.markersBoundaryline);
              this.markersBoundaryline.length = 0;
              boundarylinePath.length = 0;
            } else if (this.boundarySign === 1) {
              map.remove(boundaryArae);
              map.remove(this.markersBoundary);
              boundaryPath.length = 0;
              this.markersBoundary.length = 0;
              copy.length = 0;
              this.boundarySign = 0;
              map.on('click', this.addMarker)
            }
          } else if (this.pointType === 1) {
            if (this.markersObstacleline.length === 0 && this.markersObstacle.length === 0) return;
            if (this.obstacleSign === 0) {
              map.remove(obstacleline);
              map.remove(this.markersObstacleline);
              this.markersObstacleline.length = 0;
              obstaclelinePath.length = 0;
            } else if (this.obstacleSign === 1) {
              map.remove(obstacleArea);
              map.remove(this.markersObstacle);
              obstaclePath.length = 0;
              this.markersObstacle.length = 0;
              copy3.length = 0;
              this.obstacleSign = 0;
              map.on('click', this.addMarker)
            }
          }
        }
      },
    },
    components:{
      XButton,
      Group,
      XSwitch,
      InlineXSwitch,
      GridItem,
      Grid,
    },
  }
</script>
