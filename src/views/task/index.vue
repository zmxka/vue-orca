<template>
  <div class="task">
    <div v-for="shipTask in taskList" :key="shipTask.id">
      <div class="task-p">
        <masker class="masker" color="(255, 255, 255)" @click.native="goTask(shipTask)">
          <div class="m-img"></div>
          <div class="m-title">
            <img class="img" slot="icon" src="../../../static/img/clean/gardenSelected.png" alt="">
            {{shipTask.task_name === null ? '未定义' : shipTask.task_name}}
            <br/>
            <div class="m-ship">执行船体：{{shipTask.ship_number}}</div>
            <div class="m-func">模式：{{shipTask.route_type}}</div>
            <div class="m-turns">圈数：{{shipTask.turns}}</div>
          </div>
        </masker>
      </div>
    </div>
    <XButton class="queren" style="background-color: white" @click.native="addTask()">添加</XButton>
  </div>
</template>

<script>
  import {Masker, XButton} from 'vux';
  import {findTask} from '../../api/api';

  export default {
    name: "task",

    data() {
      return {
        taskList: [],
      }
    },

    mounted() {
      this.findTasks();
    },
    methods: {
      addTask(){
        this.$router.push({ path: '/taskInfo'})
      },
      goTask(task) {
        this.$router.push({ path: '/taskInfo?task=' + task.id})
      },
      findTasks() {
        findTask({ship_id: 5}).then(res => {
          if (res.code === 200) {
            this.taskList = res.data;
            for(let i in this.taskList){
              if((this.taskList[i]).route_type === 1){
                (this.taskList[i]).route_type = "自主循迹";
              }
              else if ((this.taskList[i]).route_type === 2){
                (this.taskList[i]).route_type = "智慧清洁";
              }
              else if ((this.taskList[i]).route_type === 3){
                (this.taskList[i]).route_type = "水质检测";
              }
              else if ((this.taskList[i]).route_type === null){
                (this.taskList[i]).route_type = "查询失败";
              }
            }
          }
        })
      },
    },
    components: {
      Masker,
      XButton
    },
  }
</script>

<style lang="less" scoped>
  .task {
    overflow-y: scroll;
    height: 101%;
    background-color: rgb(220, 220, 223);
  }

  .task-p {
    padding-top: 2%;
    padding-left: 2%;
    width: 47%;
    display: inline;
    float: left;
  }

  .masker {
    border-radius: 10px;
    background-color: rgba(255, 255, 255);
    box-shadow: 6px 6px 8px hsl(240, 2%, 73%);
    height: 115px;
  }

  .m-img {
    padding-bottom: 33%;
  }

  .m-title {
    /*color: #fff;*/
    /*text-align: center;*/
    /* 字体阴影 */
    /*text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);*/
    /*font-weight: 500;*/
    font-size: 16px;
    position: absolute;
    left: 10px;
    /*right: 0;*/
    /*width: 100%;*/
    /*text-align: center;*/
    top: 50%;
    transform: translateY(-50%);
  }

  .img {
    width: 10px;
  }

  .m-time {
    font-size: 12px;
    padding-left: 15px;
  }

  .queren{
    top: 2vh;
    margin-left:20vw;
    width: 60vw;
  }
</style>
