export default {
    // 获取字母栏当前索引
    getLetterIndex(state) {
        return state.letterIndex
    },
    getLetterScrollTop(state) {
        return state.letterScrollTop
    },
    getUserStatus(state) {
        return state.status
    },
    getPublishStatus(state) {
        return state.isPublish
    },
    /**
     * 设置授权弹框是否显示
     */
    getAuthAlert(state) {
        return state.authAlert
    }
}