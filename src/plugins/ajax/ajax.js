/**
 * 异步请求网络数据
 * @param {Object} Vue Vue的实例
 * @param {Object} options 请求配置
 * @return {Function} install 插件实例安装入口
 */
import { netWorkConfig } from '../config.js'
const AJAX_ARR = []
export default {
	install(Vue, options) {
        // 默认参数配置
        const DEFAULT_CONFIG = {
            // 是否显示loading
            load: true,
            // 在有错误的情况下是否使用默认报错
            error: true,
            // 中断当前请求
            cancel(){}
        }
		Vue.prototype.$ajax = (action, data = {}) => {
            // 接口的请求须带上登录的sessionId
            let sessionId = wx.getStorageSync('sessionId') || ''
            if (data && sessionId) {
                data.sessionid = sessionId
            }
            let param = Object.assign({}, DEFAULT_CONFIG, data)
            AJAX_ARR.push(param)
            return new Promise((resolve, reject) => {
                param.load &&  wx.showLoading({
                    title: '数据加载中'
                })
                let requestTask = wx.request({
                    url: `${param.apiUrl || netWorkConfig.serverApi}?action=${action}`,
                    method: 'POST',
                    header:{
                        'content-type': 'application/x-www-form-urlencoded',
                        index: 1
                    },
                    data,
                    success(res) {
                        let result = res.data
                        if (result.code === 200) {
                            resolve({
                                status: result.code,
                                message: result.message,
                                data: result.data
                            })
                        } else {
                            errorHandler(result.message, param.error)
                            reject({
                                status: result.code,
                                message: result.message,
                                data: result.data
                            })
                        }
                    },
                    fail(error) {
                        errorHandler('服务器错误，请求失败', '服务器错误 ')
                        reject({
                            status: 500,
                            message: '服务器错误，请求失败',
                            data: null
                        })
                    },
                    complete(data) {
                        AJAX_ARR.splice(0, 1)
                        if (AJAX_ARR.length <= 0) {
                            wx.hideLoading()
                        } else {
                            let num = 0
                            AJAX_ARR.forEach(item => {
                                if (!item.load) {
                                    num++
                                }
                            })
                            if (num >= AJAX_ARR.length) {
                                wx.hideLoading()
                            }
                        }
                    }
                })
                param.cancel(requestTask)
            })
        }
	}
}


/**
 * 错误处理
 * @param {String} title 错误信息
 * @param {Boolean} error 是否显示错误信息
 */
const errorHandler = (title, error) => {
    if (!error) {
        return
    }
    wx.showToast({
        title,
        icon: 'none'
    })
}