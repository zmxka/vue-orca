function GetDistance( lat1,  lng1,  lat2,  lng2){
  let radLat1 = lat1*Math.PI / 180.0;
  let radLat2 = lat2*Math.PI / 180.0;
  let a = radLat1 - radLat2;
  let  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s *6378.137 ;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10;
  return s;

}
//知道总路程和速度。需要开始跑的时间的
function getDistant(curr,route,turns){
  let temp = route.split(";");
  temp.unshift(curr);
  //知道总路程，存储起来，
}
function getCleanDistant(curr,route,areaDis,turns){

}
