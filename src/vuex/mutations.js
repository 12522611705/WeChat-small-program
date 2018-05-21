export default {
    /**
     * 设置字母栏当前选中的索引
     */
    setLetterIndex(state, index) {
        state.letterIndex = index
    },
    	/**
	 * 标识当前在滚动，letterlist需要变化
	 */
	letterScroll(state, scrollTop) {
        state.letterScrollTop = scrollTop
    },
    /**
     * 保存用户的状态
     */
    userStatus(state, status) {
        state.status = status
    },
    /**
     * 保存发布状态
     */
    publishStatus(state, value) {
        state.isPublish = value
    },
    /**
     * 设置授权弹框是否显示
     */
    setAuthAlert(state, bool) {
        state.authAlert = bool
    }
}