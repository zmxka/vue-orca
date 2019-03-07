import Vue from 'vue'
import toastComponent from '/components/toast'

// 返回一个扩展实例构造器
const ToastConstructor = Vue.extend(toastComponent);

// 定义弹出组件的函数，接收2个参数，要显示的文本和显示时间
function showToast(text, duration = 2000) {

  // 实例化一个toast.vue
  const toastDom = new ToastConstructor({
    el: document.createElement('div'),
    data() {
      return {
        text: text,
        showWrap: true,
        showContent: true
      }
    }
  });

  // 把实例化的toast.vue添加到body里
  document.body.appendChild(toastDom.$el);

  // 提前250ms执行淡出动画(再css里面设置的隐藏动画持续是250ms)
  setTimeout(() => {toastDom.showContent = false}, duration - 250);
  // 过了duration时间后隐藏整个组件
  setTimeout(() => {toastDom.showWrap = false}, duration);
}

// 注册为全局组件的函数
function registryToast() {
  // 将组件注册到vue的原型链里去
  // 这样就可以在所有vue的实例里面使用this.$toast()
  Vue.prototype.$toast = showToast
}

export default registryToast
