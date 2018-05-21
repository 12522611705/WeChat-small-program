<style lang='less' scoped>
    .footer-bar {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 80rpx;
        padding: 10rpx 0rpx;
        background-color: #f8f8f8;
        box-shadow: 0 3px 10px #b2b2b2;
        .footer-bar__item { 
            flex: 1;
            .iconfont{
                font-size:40rpx !important;
                margin-bottom: 4rpx;
            }
            &.active{
                color: #65A4F4;
                .text-sliver{
                    color: #65A4F4 !important;
                }
            }
        }
    }
</style>

<template>
    <div class="container footer-bar flex-row-center">
        <div 
            class="flex-row-column footer-bar__item" 
            :key="index" 
            v-for="(bar, index) in tabBar" 
            @click.stop="toPage(index)"
            :class="{'active' : tabIndex === index}">
            <i 
            class="text-18 iconfont text-sliver"
            :class="bar.icon">
            </i>
            <span class="text-sliver text-12">
                {{bar.name}}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tabBar: [
                {
                    icon: 'icon-faxian',
                    name: '发现',
                    path: 'pages/index/main',
                    login: true
                },
                {
                    icon: 'icon-renmaiwangluo',
                    name: '人脉',
                    path: 'pages/contacts/main',
                    login: true
                },
                {
                    icon: 'icon-xiaoxi',
                    name: '消息',
                    path: 'pages/notice/main',
                    login: true
                }
            ],
            // 当前选中的tab
            tabIndex: 0,
            // 当前登录次数
            loginNum: 0
        }
    },
    mounted() {
        this.getCurrentPageUrl()
    },
    onShow() {
        this.getCurrentPageUrl()
    },
    methods: {
        getCurrentPageUrl() {
            let pages = getCurrentPages()               // 获取加载的页面
            let currentPage = pages[pages.length - 1]   // 获取当前页面的对象
            let url = currentPage.route                 // 当前页面url
            for (let i = 0, len = this.tabBar.length; i < len; i++) {
                let item = this.tabBar[i]
                if (item.path === url) {
                    this.tabIndex = i
                    break
                }
            }
        },
        /**
         * 跳转页面
         * @param {Number} index 当前点击tab索引
         */
        toPage(index) {
            // 消息tab需要登录，并且完善名片才能看
            if (index == 2) {
                let status = this.$checkAuth()
                if (!status) {
                    return
                }
            }
            if (index === this.tabIndex) {
                return
            }
            this.tabIndex = index
            wx.redirectTo({
                url: `/${this.tabBar[index].path}`
            })
        }
    }
}
</script>