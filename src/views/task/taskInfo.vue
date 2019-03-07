<template>
  <div class="task">
    <div class="task-info">
      <div class="task-masker">
        <div class="task-title">任务名称</div>
        <group class="task-input">
          <x-input v-model="taskName" label-width="4em" placeholder="请输入任务名称" style="text-align: left"></x-input>
        </group>
      </div>
    </div>
    <div class="task-info">
      <div class="task-masker">
        <div class="task-title">选择船只</div>
        <group class="task-select">
          <selector class="route-ship" :options="ships" v-model="ship"></selector>
        </group>
      </div>
    </div>
    <div class="task-info">
      <div class="task-masker">
        <div class="task-title">选择功能</div>
        <div class="task-box">
          <checker v-model="demo2" default-item-class="task1-item" selected-item-class="task1-item-selected"
                   @on-change="routeChange">
            <checker-item class="task-mode" value="1"></checker-item>
            <checker-item class="task-mode" value="2"></checker-item>
            <checker-item class="task-mode" value="3"></checker-item>
          </checker>
          <div class="task-mode">
            <span class="task-mode-name">自主循迹</span>
            <span class="task-mode-name">智慧清洁</span>
            <span class="task-mode-name">水质检测</span>
          </div>
        </div>
      </div>
    </div>
    <div class="task-info">
      <div class="task-masker" style="height: 50vh">
        <div class="task-title">选择路径</div>
        <group class="task-select">
          <selector class="task-route" :options="options1" :value-map="['id', 'name']" v-model="routeId"
                    @on-change="onaaa"></selector>
        </group>
        <showMap :message="this.message"></showMap>
      </div>
    </div>
    <div class="task-info">
      <div class="task-masker">
        <div class="task-title">选择时间</div>
        <group class="task-time">
          <datetime class="task-data" :title="'选择时间'" format="HH:mm" v-model="value6" @on-change="change" clear-text="清除"
                    @on-clear="clearValue"></datetime>
        </group>
      </div>
    </div>
    <div class="task-info">
      <div class="task-masker">
        <div class="task-title">选择重复</div>
        <div class="task-box" style="margin-left:5vw">
          <checker v-model="date" type="checkbox" default-item-class="task2-item"
                   selected-item-class="task2-item-selected" @on-change="cycleChange">
            <checker-item :value="i" v-for="i in [1, 2, 3, 4, 5, 6, 7]" :key="i"></checker-item>
          </checker>
          <div class="task-date">
            <span class="task-date-name">周一</span>
            <span class="task-date-name">周二</span>
            <span class="task-date-name">周三</span>
            <span class="task-date-name">周四</span>
            <span class="task-date-name">周五</span>
            <span class="task-date-name">周六</span>
            <span class="task-date-name">周日</span>
          </div>
        </div>
      </div>
    </div>
    <div class="task-info">
      <div class="task-masker">
        <div class="task-title">循环次数</div>
        <group>
          <x-number v-model="turns" :min="1" :max="5" :value="1" :align="'left'"></x-number>
        </group>
      </div>
    </div>
    <x-button class="task-btn" type="primary" @click.native="submit">确定</x-button>
    <x-button v-if="this.$route.query.task != null" class="task-btn" type="default" @click.native="del"
              style="color: white">删除
    </x-button>
    <x-button class="task-btn" type="warn" @click.native="cancel">取消</x-button>
    <br>
    <br>
    <br>
  </div>
</template>

<script>
  import {Masker, XButton, Selector} from 'vux';
  import {Datetime, Group, XInput} from 'vux'
  import {Checker, CheckerItem, XNumber} from 'vux'
  import showMap from '../../components/showMap'

  import {findOneTask, addTask, findFlagAndType, deleteTask} from '../../api/api';

  let taskId = "";

  export default {
    name: "taskInfo",

    components: {
      XInput,
      XNumber,
      Masker,
      XButton,
      Group,
      Datetime,
      Checker,
      CheckerItem,
      Selector,
      showMap
    },

    data() {
      return {
        message: "",
        date: [],
        taskName: "",
        turns: 1,
        ships: [0, 1, 2],
        ship: 1,
        task: null,
        demo2: '',
        format: 'HH:mm',
        value6: null,
        routeId: null,
        options1: [],
        all_route: "",
        cycle: "0000000"
      }
    },

    mounted() {
      this.getTaskInfo();
    },

    methods: {
      del() {
        taskId = this.$route.query.task;
        deleteTask({id: taskId}).then(res => {
          if (res.code === 200) {
            this.$router.push({path: '/task'})
          } else {
            alert("删除失败")
          }
        })
        // console.log(parseInt( this.cycle, 2))
      },

      replacePos(strObj, pos, replacetext) {
        let str = strObj.substr(0, pos - 1);
        str += replacetext;
        str += strObj.substring(pos, strObj.length);
        return str;
      },

      cycleChange() {
        this.cycle = "0000000";
        for (let i in this.date) {
          let index = this.date[i];
          this.cycle = this.replacePos(this.cycle, index, 1);
        }
        console.log(this.date);
        console.log(this.cycle)
      },

      routeChange() {
        findFlagAndType({ship_id: 5, route_type: this.demo2}).then(res => {
          if (res.code === 200) {
            this.options1 = [];
            let routes = res.data;
            for (let i in routes) {
              this.options1.push({
                id: routes[i].id,
                name: routes[i].route_name
              })
            }
            this.routeId = this.options1[0].id;
          }
        })
      },
      getTaskInfo() {
        taskId = this.$route.query.task;

        findOneTask({id: taskId}).then(res => {
          if (res.code === 200) {
            this.task = res.data;
            this.taskName = this.task.task.task_name;
            this.ship = this.task.task.ship_number;
            this.value6 = this.task.task.start_time;
            this.turns = this.task.route.turns;
            this.demo2 = this.task.route.route_type.toString();
            this.routeId = this.task.route.id;
            this.cycle = this.task.task.cycle.toString(2);
            let len = 7 - this.cycle.length;
            while (len > 0) {
              this.cycle = 0 + this.cycle;
              len -= 1
            }
            console.log(this.cycle);

            for (const i in this.cycle) {
              if (this.cycle[i] === 1) {
                this.date.push(parseInt(i) + 1)
              }
            }
            findFlagAndType({ship_id: 5, route_type: this.demo2}).then(res => {
              if (res.code === 200) {
                let routes = res.data;
                for (let i in routes) {
                  this.options1.push({
                    id: routes[i].id,
                    name: routes[i].route_name
                  })
                }
              }
            })
          }
        })
      },

      submit() {
        let type = 1;
        taskId = this.$route.query.task;
        if (typeof (taskId) == "undefined") {
          type = 0
        }
        this.cycle = parseInt(this.cycle, 2);
        addTask({
          id: taskId,
          task_name: this.taskName,
          ship_id: 5,
          ship_number: this.ship,
          route_id: this.routeId,
          start_time: this.value6,
          turns: this.turns,
          cycle: this.cycle,
          type: type,
        }).then(res => {
          if (res.code === 200) {
            this.$router.push({path: '/task'})
          }
        })
      },

      cancel() {
        this.$router.push({path: '/task'})
      },

      change(value) {

      },

      clearValue() {
        this.value6 = ''
      },
      onaaa(val) {

      }
    },
    watch: {
      'routeId': function (newData, oldData) {
        this.data = newData;
        this.message = newData;
      }
    }
  }
</script>

<style lang="less" scoped>
  .task {
    overflow-y: scroll;
    height: 101%;
    background-color: rgb(220, 220, 223);
  }
  .task-info {
    padding-top: 2%;
    width: 96%;
    display: inline;
    float: left;
  }
  .task-masker {
    margin-left: 4%;
    margin-top: 2%;
    padding-top: 4%;
    border-radius: 10px;
    background-color: rgba(255, 255, 255);
    box-shadow: 6px 6px 8px hsl(240, 2%, 73%);
    height: 90px;
  }
  .task-title {
    font-size: 16px;
    margin-left: 5%;
    margin-top: 1%;
  }
  .task-box {
    padding: 0 15px;
    margin-top: 3%;
    margin-left: 10%;
  }
  .task-mode {
    margin-left: 2vw;
    font-size: 3vw;
  }
  .task-mode-name {
    margin-left: 4.5vw;
  }
  .task1-item {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
    margin-left: 15%;
  }
  .task1-item-selected {
    border-color: green;
    background-color: green;
  }
  .task-date {
    margin-left: 2vw
  }
  .task-date-name {
    font-size: 4vw;
    margin-left: 0.35vw;
  }
  .task2-item {
    width: 6vw;
    height: 6vw;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
    margin-left: 3vw;
  }
  .task2-item-selected {
    border-color: green;
    background-color: green;
  }
  .task-btn /deep/ button.weui-btn, input.weui-btn {
    top: 2vh;
    margin-left: 20vw;
    width: 60vw;
  }
  .task-input {
    margin-top: -18px;
  }
  .task-input /deep/ .weui-input {
    border-radius: 16px;
    background: #fff;
    border: 1px solid #000;
    -webkit-border-radius: 16px;
    -moz-border-radius: 16px;
    padding-left: 10px;
    height: 1.8em;
    box-sizing: border-box;
  }
  .task-input /deep/ .vux-x-input .weui-icon {
    padding-left: 0;
  }

  .task /deep/ .weui-cells:before {
    display: none;
  }
  .task /deep/ .weui-cells:after {
    display: none;
  }

  .task-select {
    margin-top: -8px;
    width: 91.1%;
    margin-left: 4.7%;
  }
  .task-select /deep/ .weui-cell_select .weui-select {
    border-radius: 16px;
    background: #fff;
    border: 1px solid #000;
    -webkit-border-radius: 16px;
    -moz-border-radius: 16px;
    padding-left: 10px;
    height: 1.8em;
    box-sizing: border-box;
    line-height: 32px;
  }

  .task-time {
    margin-top: -8px;
    width: 91.1%;
    margin-left: 4.7%;
  }
  .task-data {
    border-radius: 16px;
    background: #fff;
    border: 1px solid #000;
    -webkit-border-radius: 16px;
    -moz-border-radius: 16px;
    height: 1.8em;
    box-sizing: border-box;
    line-height: 32px;
    text-decoration: none;
  }
  .task-time /deep/ .weui-cell_access .weui-cell__ft:after {
    display: none;
  }
</style>

