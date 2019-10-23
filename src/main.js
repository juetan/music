// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

import fastclick from 'fastclick'
fastclick.attach(document.body)

import stylus from './common/stylus/index.styl'
Vue.config.productionTip = false

import axios from 'axios'
Vue.prototype.$http = axios

import vueLazyLoad from 'vue-lazyload'
Vue.use(vueLazyLoad,{
  loading: require('common/image/default.png')
})

import store from './store'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
