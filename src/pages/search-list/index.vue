<style lang='less' scoped>
.search-contacts, .search-contacts__info,.search-info__list{
    flex: 1;
    position: relative;
    min-height: 100%;
}
.search-list__item{
    padding: 20rpx;
    border-bottom: 1px solid #eee;
    background: #fff;
    .friend-avater{
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        overflow: hidden;
        background: #f2f2f2;
        align-self:flex-start;
        .avater-img{
            width: 100%;
        }
    }
    .friend-info{
        flex: 1;
        width: 100%;
        overflow: hidden;
        line-height: 42rpx;
    }
    .friend-btn{
        align-self:flex-start;
        font-size: 24rpx;
        background: #fff;
        padding: 0 20rpx;
        height: 26px;
        line-height: 28px;            
    }
}
</style>

<template>
    <div class="search-contacts flex-column-start">
        <div class="search-box">
            <div class="search-bar flex-row-start" @click="foucuFn">
                <icon 
                type="search" 
                size="14" 
                class="ML-10"/>
                <input 
                    type="text"
                    class="PL-10 search-bar__input"
                    v-model="search"
                    placeholder="搜索发现更多人脉"
                    confirm-type="search"
                    disabled/>
            </div>
        </div>
        <div class="search-contacts__info flex-column-start">
            <div class="search-info__list">
                <nav-bar @change="navBarChange" :list="navList"></nav-bar>
                <no-data v-if="friendList && friendList.length <= 0"></no-data>
                <div 
                v-if="friendList && friendList.length > 0"
                class="search-list__item flex-row-start" 
                v-for="(item, index) in friendList"
                :key="index">
                    <div class="friend-avater MR-20" @click="goInfo(item)">
                        <img class="avater-img" :src="item.avatar || avatar" mode="widthFix"/>
                    </div>
                    <div class="friend-info">
                        <div class="text-16">{{item.username}}</div>
                        <div class="text-overflow__1 text-14 text-666">{{item.company}}</div>
                        <div class="text-overflow__1 text-666 text-14" v-if="item.mainBrands">主营：{{item.mainBrands}}</div>
                    </div>
                    <div class="btn btn-blue-line friend-btn ML-10" @click="addFriend(item)">
                        加好友
                    </div>
                </div>
            </div>
            <end-line 
                v-if="load && friendList && friendList.length > 0" 
                :status="load">
            </end-line>
        </div>
        <!-- 需要使用 button 来授权登录 -->
        <alert
            :title="'温馨提示'"
            :content="'是否允许微信登录授权'"
            is-wx-bind
            v-if="getAuthAlert"
            @right="getUserInfo"
            @close="setAuthAlert(false)">
        </alert>

        <!-- 添加好友超过上限 -->
        <alert 
            v-if="alertShow" 
            @close="alertShow = false"
            content='获取新的名额?'
            title="今日加好友名额已用完"
            share
            @right="alertCall">
        </alert>
    </div>
</template>

<script>
import itemModule from '@/components/item-module/index.vue'
import navBar from '@/components/nav-bar/index.vue'
import noData from '@/components/no-data/index.vue'
import endLine from '@/components/end-line/index.vue'
import {throttle} from '@/assets/utils/index.js' 
import avatar from '@/assets/images/default.png'
import alert from '@/components/alert/index.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
    data() {
        return {
            // 当前请求页数
            page: 1,
            // 当前搜索框文字
            search: '',
            // 好友数据列表
            friendList: null,
            // 当前加载状态 1：加载中  2：没有更多  0：正常状态
            load: 1,
            // tab栏数据
            navList: [{
                name: '全部城市'
            }, {
                name: '全部同行'
            }, {
                name: '全部品牌'
            }],
            // 默认头像
            avatar,
            // 当前添加好友是否达到上限
            alertShow: false
        }
    },
    // 页面上拉触底
    onReachBottom() {
        if (!this.load) {
            this.page++
            this.getFriendList(this, false)
        }
    },
    computed: {
        ...mapGetters([
            'getAuthAlert'
        ])
    },
    onUnload() {
        this.search = ''
        this.page = 1
        this.load = 1
        this.navList = [{
            name: '全部城市'
        }, {
            name: '全部同行'
        }, {
            name: '全部品牌'
        }]
    },
    onShow() {
        this.search = this.$root.$mp.query.search
        let selectCitys = wx.getStorageSync('selectCitys')
        let selectPeer = wx.getStorageSync('selectPeer')
        let selectBrand = wx.getStorageSync('selectBrand')
        selectBrand = selectBrand && selectBrand.length > 0 ? selectBrand[0] : null
        this.changeHandler(selectCitys, 0, '全部城市')
        this.changeHandler(selectPeer, 1, '全部同行')
        this.changeHandler(selectBrand, 2, '全部品牌')
        this.search && this.getFriendList(this)
    },
    components: {
        itemModule,
        navBar,
        noData,
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
         * 监听当前的数据和以前的是否有区别
         * @param {Object} item 当前最新数据
         * @param {Number} navIndex 当前是nav的第几个数据
         * @param {String} noData 没有数据需要显示的内容
         */
        changeHandler(item, navIndex, noData) {
            // 修改了城市
            if (item && this.navList[navIndex].id != item.id) {
                this.itemHandler(item, navIndex)
            // 如果上一次有，这次回来没有了
            } else if (this.navList[navIndex].id && !item) {
                this.itemHandler({name: noData}, navIndex)
            }
        },
        /**
         * 点击搜索框返回上一级
         */
        foucuFn() {
            wx.navigateBack()
        },
        /**
         * 重置navtab 数据
         */
        restoreNav() {
            this.navList = [{
                name: '全部城市'
            }, {
                name: '全部同行'
            }, {
                name: '全部品牌'
            }]
            wx.removeStorageSync('selectCitys')
            wx.removeStorageSync('selectPeer')
            wx.removeStorageSync('selectBrand')
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
        /**
         * 弹框确认回调
         */
        alertCall() {
            this.$ajax('API.MembersCard.SharePost', {
                sharetype: 2
            }).then(data => {
                if (data.data.code === '02') {
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
         * 切换tab index
         * @param {Number} index 当前切换的index
         */
        navBarChange(index) {
            switch (index) {
                case 0:
                    wx.navigateTo({
                        url: '/pages/citys/main'
                    })
                    break
                case 1:
                    wx.navigateTo({
                        url: '/pages/business/main'
                    })
                    break
                case 2:
                    wx.navigateTo({
                        url: '/pages/brand/main?radio=1'
                    })
                    break
            }
        },
        /**
         * 选中某个类型
         * @param {Object} item 当前选中对象
         * @param {Number} index 当前选中索引
         */
        itemHandler(item, index) {
            this.navList[index] = item
            this.getFriendList(this)
        },
        /**
         * 获取好友列表
         * @param {Object} vm 当前实例对象
         * @param {Boolean} replace 当前是否需要替换成新数据
         */
        getFriendList:throttle(($this, replace = true) => {
            // 如果当前没有任何筛选条件
            if (!$this.search && !$this.navList[2].id && !$this.navList[1].id && !$this.navList[0].id) {
                $this.friendList = []
                return
            }
            $this.page = replace ? 1 : $this.page
            $this.load = 1
            $this.$ajax('API.MembersCard.SearchCard', {
                page: $this.page,
                name: $this.search,
                brandcond: $this.navList[2].id,
                peercond: $this.navList[1].id,
                citycond: $this.navList[0].id
            }).then(data => {
                $this.friendList = replace ? data.data.befriends : [...$this.friendList, ...data.data.befriends]
                $this.load = data.data.befriends.length < 10 ? 2 : 0
            })
        }, 200),
    }
}
</script>