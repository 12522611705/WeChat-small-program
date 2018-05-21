import Vue from 'vue'
import App from './index'
new Vue(App).$mount()

export default {
    config: {
        "enablePullDownRefresh": true,
        "backgroundTextStyle": 'dark'
    }
 }
