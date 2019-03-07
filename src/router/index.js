import Vue from 'vue'
import Router from 'vue-router'

const Index = resolve => require(['/views/login'], resolve); // 登录
const Home = resolve => require(['/views/home'], resolve); // 主页
const Route = resolve => require(['/views/route/index'], resolve);
const RouteInfo = resolve => require(['/views/route/routeInfo'], resolve);
const Task = resolve => require(['/views/task/index'], resolve);
const TaskInfo = resolve => require(['/views/task/taskInfo'], resolve);
const Border = resolve => require(['/views/border/index'], resolve);

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/',
    meta: { requireAuth: true },
  },
  {
    path: '/',
    name: '登录',
    component: Index,
    components: {
      index: Index,
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/route',
    name: 'route',
    component: Route,
  },
  {
    path: '/routeInfo',
    name: 'routeInfo',
    component: RouteInfo,
  },
  {
    path: '/task',
    name: 'task',
    component: Task,
  },
  {
    path: '/taskInfo',
    name: 'taskInfo',
    component: TaskInfo,
  },
  {
    path: '/border',
    name: 'border',
    component: Border,
  },
  // {
  //   path: '/cruise',
  //   name: 'cruise',
  //   component: Cruise,
  //   meta: { requireAuth: false },
  //   // redirect: '/cruise',
  //   iconCls: '', // 图标
  //   // children: [
  //   //   {
  //   //     path: '/cruise',
  //   //     name: 'cruise',
  //   //     component: Cruise,
  //   //     meta: { requireAuth: false },
  //   //   },
  //   // ]
  // },
  // {
  //   path: '/clean',
  //   name: 'clean',
  //   component: Clean,
  //   meta: { requireAuth: false },
  //   // redirect: '/clean',
  //   iconCls: '', // 图标
  //   // children: [
  //   //   {
  //   //     path: '/clean',
  //   //     name: 'clean',
  //   //     component: Clean,
  //   //     meta: { requireAuth: true }
  //   //   },
  //   // ]
  // },
  // {
  //   path: '/detect',
  //   name: 'detect',
  //   component: Detect,
  //   meta: { requireAuth: false },
  //   // redirect: '/detect',
  //   iconCls: '', // 图标
  //   // children: [
  //   //   {
  //   //     path: '/detect',
  //   //     name: 'detect',
  //   //     component: Detect,
  //   //     meta: { requireAuth: true }
  //   //   },
  //   // ]
  // },
];

const router = new Router({
  mode: 'history',
  base: './',
  routes
});

export default router;

