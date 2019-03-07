import axios from 'axios'

// const HttpUrl = 'http://120.78.143.247:7777/orcatech';
// axios 配置

// 请求的超时时间
axios.defaults.timeout = 5000;
// 允许携带cookie
axios.defaults.withCredentials = true;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json; charset=utf-8',
    };
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // if (this.$route.path )
    // this.$router.push('/');
    return Promise.reject(error);
  });

export default {
  // fetchGet (url, params = {}) {
  //   return new Promise((resolve, reject) => {
  //     axios.get(HttpUrl + url, params)
  //       .then(response => {
  //         resolve(response.data);
  //       })
  //       .catch(err => {
  //         reject(err)
  //       })
  //   })
  // },
  // fetchPost (url, params = {}) {
  //   return new Promise((resolve, reject) => {
  //     axios.post(HttpUrl + url, params)
  //       .then(response => {
  //         resolve(response.data);
  //       }, err => {
  //         reject(err);
  //       })
  //   })
  // }
  // fetchGet (url, params = {}) {
  //   return new Promise((resolve, reject) => {
  //     axios.get(url, params)
  //       .then(response => {
  //         resolve(response.data);
  //       })
  //       .catch(err => {
  //         reject(err)
  //       })
  //   })
  // },
  fetchPost (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err);
        })
    })
  }
}
