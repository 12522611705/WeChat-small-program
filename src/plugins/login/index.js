export default {
	install(Vue, options) {
        /**
         * 进行登录处理
		 * @param { Object } param 参数
         */
		let code = ''
		Vue.prototype.$login = (param = {}) => {
            wx.showLoading({
                title: '登录中，请稍后'
            })
			return new Promise((reslove, reject) => {
				wx.login({
					success: (result) => {
						code = code || result.code
						let data = Object.assign({
							code: code || result.code,
							load: false
						}, param)
						Vue.prototype.$ajax('API.MembersCard.WeixinAuth', data).then(result => {
							const res = result.data
							/**
							 * 1: 登录成功 
							 * 2: 登录失败 
							 * 3: 需要绑定手机号 
							 * 4: 过期，重新登录 
							 * 5: 已绑定手机，但是还没有创建名片 
							 */
							const status  = res.status
							Vue.prototype.$loginStatus = status
							// 等于2代表需要授权
							if (res.status === 2) {
								reject()
								return
							}
							if (res.status === 1 || res.status === 3 || res.status === 5) {
								// 保存到本地缓存的数据
								let storageData = {
									avatar: res.avatar,
									city: {
										province_id: res.provinceId,
										province: res.province,
										city_id: res.cityId,
										city: res.city,
										address: res.address || ''
									},
									mobile: res.mobile,
									username: res.username
								}
								wx.setStorageSync('userInfo', storageData)
								wx.setStorageSync('uid', res.uid)
							}

							if (res.status === 4) {
								Vue.prototype.$login()
							}
                            wx.setStorageSync('sessionId', res.sessionid)
                            wx.hideLoading()
							reslove(res)
						}).catch(() => {
                            wx.hideLoading()
							reject()
						})
					},
					fail: (error) => {
                        wx.hideLoading()
						wx.showToast({
							title: '微信登录失败',
							icon: 'none'
						})
						reject()
					}
				})
			})
		}
		/**
		 * 当前登录状态校验
         * @returns 返回当前通过状态
		 */
		Vue.prototype.$checkLogin = () => {
			let $this = Vue.prototype
			// 如果当前是登录成功并且完善了名片，直接返回true
			if ($this.$loginStatus === 1) {
				return true
			}
			// 如果当前是登录失败，或者登录过期，重新登录
			if (!$this.$loginStatus || $this.$loginStatus === 4) {
				$this.$login()
				return false
			}
			// 如果当前没有创建名片，则需要提示用户去创建名片
			if ($this.$loginStatus === 3 || $this.$loginStatus === 5) {
				wx.showModal({
					title: '温馨提示',
					content: '请先完善名片信息',
					confirmText: '确认完善',
					success(res) {
						if (res.confirm) {
							wx.navigateTo({
								url: `/pages/edit/main`
							})
						}
					}
				})
				return false
			}
		}

		/**
		 * 校验当前授权状态
		 */
		Vue.prototype.$checkAuth = () => {
			if (Vue.prototype.$loginStatus === 2) {
				Vue.prototype.$store.commit('setAuthAlert', true)
				return false
			} else {
				return true
			}
		}
	}
}