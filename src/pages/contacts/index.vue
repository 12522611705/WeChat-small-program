<style lang='less' scoped>
.container-may__title{
    padding: 20rpx 30rpx;
    background: #fff;
    border-bottom: 1px solid #EEEEEE;
}
.container-may__content{
    display: -webkit-box;
    overflow: auto;
    width: 100%;
    padding: 40rpx 0 60rpx;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    margin-bottom: 20rpx; 
    .container-may__item{
        width: 256rpx;
        background: #fff;
        margin-left: 30rpx;
        padding: 20rpx 0;
        border-radius: 16rpx;
        box-shadow: 0px 2px 4px 0px rgba(101, 164, 244, 0.33);
        border: 1px solid rgba(101, 164, 244, 0.4);
        .container-item__type{
            width:100%;
            padding:0 10px;
            overflow:hidden;
            box-sizing:border-box;
        }
        .container-item__avater{
            width: 130rpx;
            height: 130rpx;
            background: #ccc;
            border-radius: 50%;
            overflow: hidden;
            .avater{
                width: 130rpx;
                height: 130rpx;
            }
        }
        .add-friend{
            width: 160rpx;
            height: 48rpx;
            line-height: 48rpx;
            font-size: 26rpx;
        }
    }
}
.container-friends{
    background: #fff;
    padding: 10rpx;
}
</style>

<template>
    <div class="container">
        <div class="search-box">
            <div class="search-bar flex-row-start" @click="focusFn">
                <icon 
                type="search" 
                size="14" 
                class="ML-10"/>
                <input 
                    class="PL-10 search-bar__input"
                    placeholder="搜索人名、公司、主营、品牌"
                    disabled/>
            </div>
        </div>
        <div class="container-may" v-if="befriends && befriends.length > 0">
            <list-item 
                left-icon="icon-moshengren"
                value="你可能认识他们"
                right-name="更多"
                @click="goRecommed"
                @right="goRecommed">
            </list-item>
            <div class="container-may__content">
                <div 
                class="container-may__item flex-column-center" 
                v-for="(item, index) in befriends" 
                :key="index">
                    <div class="container-item__avater">
                        <img class="avater" :src="item.avatar || avatar" mode="widthFix"/>
                    </div>
                    <div class="container-item__name text-16 MT-5 MB-5">{{item.username}}</div>
                    <div class="container-item__type text-center text-overflow__1 MB-5 text-14 text-sliver">{{item.title}}</div>
                    <button 
                    class="btn btn-blue add-friend" 
                    @click="addFriend(item, index)" 
                    :disabled="item.friend">
                        添加好友
                    </button>
                </div>
            </div>
        </div>
        <list-item
            left-icon="icon-haoyou"
            value="我的好友"
            :right-name="friends"
            @click="goFriendList"
            @right="goFriendList">
        </list-item>
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
        <foot-bar></foot-bar>

    </div>
</template>

<script>
import search from '@/components/search/index.vue'
import listItem from '@/components/list-item/index.vue'
import footBar from '../../components/foot-bar/index.vue'
import alert from '../../components/alert/index.vue'
import { mapGetters, mapActions } from 'vuex'
import avatar from '@/assets/images/default.png'
export default {
    title: '人脉',
    onShareAppMessage() {
        return {
            title: '行业影响力的汽配名片',
            path: '/pages/index/main'
        }
    },
    data() {
        return {
            // 提示弹框是否显示
            alertShow: false,
            // 我的好友数
            friendsNum: 0,
            // 可能认识的还有列表
            befriends: null,
            // 默认头像
            avatar
        }
    },
    onShow() {
        this.getData()
    },
    computed: {
        ...mapGetters([
            'getAuthAlert'
        ]),
        friends() {
            return `${this.friendsNum}人`
        }
    },
    components: {
        search,
        listItem,
        footBar,
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
         * 获取页面数据
         */
        getData() {
            this.$ajax('API.MembersCard.Connection').then(data => {
                data.data.befriends.map(item => {
                    item.friend = false
                    return item
                })
                this.befriends = data.data.befriends
                this.friendsNum = data.data.friends
            })
        },
        /**
         * 跳转到推荐好友页面
         */
        goRecommed() {
            wx.navigateTo({
                url: '../recommend/main'
            })
        },
        /**
         * 跳转到好友列表页面
         */
        goFriendList() {
            wx.navigateTo({
                url: '../friend-list/main'
            })
        },
        /**
         * 监听搜索框获取焦点
         */
        focusFn() {
            wx.navigateTo({
                url: '../search-contacts/main'
            })
        },
        /**
         * 添加好友
         * @param {Object} item 好友信息
         * @param {Number} index 当前索引
         */
        addFriend(item, index) {
            // 添加好友需要授权和完善名片
            if(this.$checkAuth() && this.$checkLogin()) {
                this.$ajax('API.MembersCard.FollowFriend', {
                    friend_uid: item.uid
                }).then(data => {
                    // 添加成功
                    if (data.data.code === '01') {
                        item.friend = true
                        this.friendsNum++
                    // 好友添加达到上限
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
        }
    }
}
</script>