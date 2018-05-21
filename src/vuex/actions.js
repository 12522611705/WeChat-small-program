export default {
	/**
	 * 设置字母栏当前选中哪一个
	 */
	setLetterIndex(store, index) {
		store.commit('setLetterIndex', index)
	},
	/**
	 * 标识当前在滚动，letterlist需要变化
	 */
	setLetterScrollTop(store, scrollTop) {
		store.commit('letterScroll', scrollTop)
	},
	/**
	 * 设置全局的用户状态
	 */
	setUserStatus(store, status) {
		store.commit('userStatus', status)
	},
	/**
	 *  设置发布朋友圈的状态回跳
	 */
	setPublishStatus(store, value) {
		store.commit('publishStatus', value)
	},
	/**
	 * 设置授权弹框是否显示
	 */
	setAuthAlert(store, bool) {
		store.commit('setAuthAlert', bool)
	}
}
