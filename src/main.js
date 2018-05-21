import Vue from 'vue'
import App from './App'
import Vuex from './vuex/store.js'
import Ajax from './plugins/ajax/ajax.js'
import login from './plugins/login/index.js'
import './assets/less/index.less'
Vue.use(Vuex)
Vue.use(Ajax)
Vue.use(login)
Vue.config.productionTip = false
App.mpType = 'app'
new Vue(App).$mount()

// 全局混合
Vue.mixin({
	onLoad() {
		// 如果当前组件有设置title
		this.$options.title && wx.setNavigationBarTitle({
			title: this.$options.title
		})
	}
})

wx.getSystemInfo( {
	success: res => wx.setStorageSync( "systemInfo", res )
});

export default {
    // 这个字段走 app.json
    config: {
		// 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
		pages: [
			'^pages/index/main',
			'pages/detail/main',
			'pages/notice/main',
			'pages/card/main',
			'pages/edit/main',
			'pages/verify/main',
			'pages/business/main',
			'pages/brand/main',
			'pages/contacts/main',
			'pages/publish/main',
			'pages/recommend/main',
			'pages/search-contacts/main',
			'pages/search-list/main'
		],
		window: {
			backgroundTextStyle: 'light',
			navigationBarBackgroundColor: '#65A4F4',
			backgroundColor: '#F2F2F2',
			backgroundColorTop: '#F2F2F2',
			backgroundColorBottom: '#F2F2F2',
			navigationBarTitleText: '',
			navigationBarTextStyle: 'white',
			onReachBottomDistance: 150
		},
		networkTimeout: {
			"request": 20000
		}  
    }
}

