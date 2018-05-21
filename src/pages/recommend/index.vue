<style lang='less' scoped>
.friend-list__title{
    padding-top: 20rpx;
    padding-bottom: 20rpx;
}

</style>

<template>
    <div class="recommend-firned">
        <div class="search-box">
            <div class="search-bar flex-row-start" @click="focusFn">
                <icon 
                type="search" 
                size="14" 
                class="ML-10"/>
                <input 
                    class="PL-10 search-bar__input"
                    placeholder="搜索发现更多人脉"
                    disabled/>
            </div>
        </div>
        <div class="friend-list">
            <div class="text-center friend-list__title">
                今日剩余好友名额：
                <span class="text-gold">{{allow}}</span>/{{all}}
            </div>
            <div class="friend-list__content">
                <friend-item
                    :title="item.username"
                    :line-one="item.title"
                    :avatar="item.avatar"
                    line-two="主营：丰田、本田、马自达、阿尔法"
                    btn="加好友"
                    @btn="addFriend(item)"
                    @avatar="goInfo(item)"
                    v-for="(item, index) in friendList"
                    :key="index"
                    :btn-disabled="item.friend">
                </friend-item>
            </div>
        </div>
        <end-line v-if="load" :status="load"></end-line>
        <!-- 添加好友超过上限 -->
        <alert 
            v-if="alertShow" 
            @close="alertShow = false"
            content='获取新的名额?'
            title="今日加好友名额已用完"
            share
            @right="alertCall">
        </alert>

        <!-- 需要使用 button 来授权登录 -->
        <alert
            :title="'温馨提示'"
            :content="'是否允许微信登录授权'"
            is-wx-bind
            v-if="getAuthAlert"
            @right="getUserInfo"
            @close="setAuthAlert(false)"
        ></alert>

    </div>
</template>

<script>
import search from '@/components/search/index.vue'
import friendItem from '@/components/friend-item/index.vue'
import endLine from '@/components/end-line/index.vue'
import alert from '@/components/alert/index.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
    title: '推荐好友',
    data() {
        return {
            // 当前请求页数
            page: 1,
            // 好友列表
            friendList: null,
            // 当前加载状态 1：加载中 2：没有更多  0：正常状态
            load: 1,
            // 今日可添加好友数
            all: 0,
            // 今日已添加好友数
            allow: 0,
            // 弹框是否显示
            alertShow: false
        }
    },
    onShareAppMessage() {
        return {
            title: '行业影响力的汽配名片',
            path: '/pages/index/main'
        }
    },
    computed: {
        ...mapGetters([
            'getAuthAlert'
        ])
    },
    mounted() {
        this.getData()
    },
    onUnload() {
        this.page = 1
    },
    // 页面上拉触底
    onReachBottom() {
        if (!this.load) { 
            this.page++
            this.getData(false)
        }
    },
    components: {
        search,
        friendItem,
        endLine,
        alert
    },
    methods: {
        ...mapActions([
            'setAuthAlert'
        ]),
         /**
		 * 要用户进行授权
		 */
		getUserInfo (e) {
			this.$login({
				encryptedData: e.target.encryptedData,
				iv: e.target.iv
			})
		},
        /**
         * 去到名片详情页
         * @param {Object} item 当前用户信息
         */
        goInfo(item) {
            wx.navigateTo({
                url: `/pages/card/main?uid=${item.uid}`
            })
        },
        /**
         * 搜索框获取焦点
         */
        focusFn() {
            wx.navigateTo({
                url: '../search-contacts/main'
            })
        },
        /**
         * 获取联系人
         * @param {Boolean} replace 当前是否需要替换成新数据
         */
        getData(replace = true) {
            this.load = 1
            this.page = replace ? 1 : this.page
            this.$ajax('API.MembersCard.MoreFriends', {
                page: this.page
            }).then(data => {
                console.log(data, this.page)
                data.data.befriends.map(item => {
                    item.friend = false
                    return item
                })
                this.friendList = replace ? data.data.befriends : [...this.friendList, ...data.data.befriends]
                this.allow = data.data.allow
                this.all = data.data.all
                this.load = data.data.befriends.length < 10 ? 2 : 0
            }).catch(err => {
                this.load = 0
            })
        },
        /**
         * 弹框确认回调
         */
        alertCall() {
            this.$ajax('API.MembersCard.SharePost', {
                sharetype: 2
            }).then(data => {
                if (data.data.code === '01') {
                    this.getData()
                }else if (data.data.code === '02') {
                    wx.showToast({
                        title: '超过总最大分享次数',
                        icon: 'none'
                    })
                } else if (data.data.code === '03') {
                    wx.showToast({
                        title: '超过当前最大分享次数',
                        icon: 'none'
                    })
                }
            })
        },
        /**
         * 添加好友
         * @param {Object} item 好友信息
         */
        addFriend(item) {
            if(this.$checkAuth() && this.$checkLogin()) {
                this.$ajax('API.MembersCard.FollowFriend', {
                    friend_uid: item.uid
                }).then(data => {
                    if (data.data.code === '01') {
                        item.friend = true
                        this.allow--
                    } else if (data.data.code === '05') {
                        this.alertShow = true
                    } else {
                        wx.showToast({
                            title: '好友添加失败',
                            icon: 'none'
                        })
                    }
                    
                })
            }
        },
    }
}
</script>