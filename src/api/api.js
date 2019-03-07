import http from './http'
import { stringify } from "qs";

// params 对象 json
// uid=1，name=
// list?val=   val
// 登录
export const userLogin = (params) => {
  return http.fetchPost('/mobile/login/account', params);
};

export const verification = (params) => {
  return http.fetchPost('/mobile/login/verification', params);
};

export const addRoute = (params) => {
  return http.fetchPost(`/mobile/route/insert`, params);
};

export const delRouteById = (params) => {
  return http.fetchPost('mobile/route/delete', params);
};

// 侧边栏 任务
export const findTask = (params) => {
  return http.fetchPost('/mobile/task/list', params);
};

export const findOneTask = (params) => {
  return http.fetchPost('/mobile/task/select', params);
};

export const addTask = (params) => {
  return http.fetchPost('/mobile/task/insert', params);
};

export const findFlagAndType = (params) => {
  return http.fetchPost('/mobile/route/typeByFlag', params);
};

export const deleteTask = (params) => {
  return http.fetchPost('/mobile/task/delete', params);
};

export const findRouteById = (params) => {
  return http.fetchPost('/mobile/route/select', params);
};

//边界障碍
export const getBoundaryAndObstacles = (params) => {
  return http.fetchPost('/mobile/bound/list', params);
};

export const setBoundaryAndObstacles = (params) => {
  return http.fetchPost('/mobile/bound/insert', params);
};

export const delBoundaryAndObstacles = (params) => {
  return http.fetchPost('/mobile/bound/delete', params);
};
