<style lang='less' scoped>
    .container {
        position: relative;
        width: 100%;
        height:100%;
        background-color: #ffffff;
    }
    .wrapper-bg {
        height: 300rpx;
        background: -webkit-linear-gradient(#65A4F4, #FFFFFF);
        background: linear-gradient(#65A4F4, #FFFFFF);
        background-color: aqua;
    }
    .card-info-wrapper {
        margin: -25% 15px 0px;
        border-radius: 14px;
        padding: 20px;
        background-color: #ffffff;
        box-shadow: 0px 0px 4px 0px rgba(101, 164, 244, 0.73);
        .card-info {
            display: flex;
            flex-direction: column;
        }
        .card-info__avator {
            width: 58px;
            height: 58px;
            border-radius: 100%;
        }
        .card-info__intro {
            align-items: flex-start !important;
        }
        .pos-absolute {
            right: 5rpx;
            top: -10rpx;
        }
        .brand-img {
            width: 25px;
            height: 25px;
        }
        .btn-add-friend {
            float: right;
            width: 120rpx;
            height: 48rpx;
            text-align: center;
            line-height: 48rpx;
            border: 1px solid #65A4F4;
            color: #65A4F4;
            border-radius: 100rpx;
        }
        .btn-share{
            width: 120rpx;
            height: 48rpx;
            line-height: inherit;
            padding: 0;
            background-color: #fff;
            border-radius: 100rpx;
            color: #65A4F4;
            &:after {
                border: none;
            }
        }
    }
    .other-info-wrapper {
        padding: 20rpx 0rpx;
        margin-bottom: 40rpx;
        border-bottom: 1px solid #eee;
    }
    .article-list {
        position: relative;
        padding: 0px 15px 50px;
        background-color: #ffffff; 
        .article-item {
            margin-bottom: 20px;
            align-items: flex-start;
            &:last-child {
                margin-bottom: 0px;
            }
        }
        .article-item__img {
            width: 70px;
            height: 70px;
            vertical-align: top;
        }
        .article-item__text {
            flex: 1;
        }
        .date {
            width: 50px;
            margin-top: -5px;
        }
        .line {
            position: absolute;
            left: calc(50% - 3rpx);
            top: 5px;
            width: 3rpx;
            height: 90px;
            background-color: #cccccc;
            .line-circle {
                position: absolute;
                left: -2.5px;
                width: 8px;
                height: 8px;
                background-color: #cccccc;
                border-radius: 100%;
            }
        }
        .first-line {
            top: 25px;
        }
    }
    .empty-list {
        padding-top: 30px;
        text-align: center;
    }
</style>

<template>
    <div class="bg-white container">
        <div class="wrapper-bg"></div>
        <div class="card-info-wrapper">
            <div class="card-info">
                <div class="flex-row-start card-info__intro pos-relative">
                    <img :src="userInfo.avatar" class="card-info__avator" />
                    <div class="flex-row-column card-info__intro ML-15">
                        <span class="text-17">{{userInfo.username}}</span>
                        <!-- 访客未完善名片 -->
                        <span v-if="!isSelf && status != 1" class="text-sliver text-13 MT-5">名片未完善</span>
                        <div v-else>
                            <span class="text-13 MT-5" v-if="userInfo.company && !userInfo.title">{{userInfo.company}}</span>
                            <span class="text-13 MT-5" v-if="!userInfo.company && userInfo.title">{{userInfo.title}}</span>
                            <span class="text-13 MT-5" v-if="userInfo.company && userInfo.title">
                                {{userInfo.company + '&nbsp;|&nbsp;' + userInfo.title}}
                            </span>
                        </div>
                        <span class="text-13">影响力<span class="text-yellow">
                            {{userInfo.influence || 0}}</span>
                            ，高于<span
                                class="text-yellow"
                                v-if="userInfo.influence_per"
                            >{{userInfo.influence_per || 0}}%&nbsp;
                            </span>的同行
                        </span>
                        <!-- 访客未完善名片会不显示品牌列表 -->
                        <ul 
                            class="flex-row-start MT-10 card-info__intro"
                            v-if="userBrandImages.length && (status !=0 || status != 3 || status != 5)"
                        >
                            <li 
                                class="card-brand__li MR-5"
                                v-for="(img, index) in userBrandImages"
                                :key="index"
                            >
                                <img :src="img" class="brand-img"/>
                            </li>
                        </ul>
                    </div>
                    <div class="pos-absolute text-blue text-12" @click.stop="toPage('edit')" v-if="isSelf">编辑</div>
                </div>
                <div class="MT-20">
                    <div class="flex-row-between">
                        <span class="flex-row-start text-12 text-666">
                            <i class="text-blue iconfont icon-dianhua MR-5"></i>
                            {{isSelf ? userInfo.mobile : userInfo.is_friend == '1' ? userInfo.mobile : '仅好友查看'}}
                        </span>
                        <div class="btn-add-friend" v-if="isSelf">
                            <button
                                class="btn-share text-14"
                                open-type="share"
                            >分享</button>
                        </div>
                        <div
                            class="btn-add-friend text-14"
                            v-if="!isSelf && userInfo.is_friend == '0'"
                            @click.stop="toAddFriend"
                        >+好友</div>
                    </div>
                    <div class="flex-column-start MT-5" v-if="userInfo.city">
                        <span class="flex-row-start text-12 text-666">
                            <i class="text-blue iconfont icon-dizhi MR-5"></i>
                            {{userInfo.city.province + userInfo.city.city + userInfo.city.address}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="other-info-wrapper">
            <div class="info-stat">
                <ul class="flex-row-start text-13">
                    <li class="flex-row-column flex-1">
                        <span>访客</span>
                        <span class="text-yellow text-14 MB-5" v-if="status != 1 && !isSelf">1</span>
                        <span class="text-yellow text-14 MB-5" v-else>{{statistics.visits || 0}}</span>
                    </li>
                    <li class="flex-row-column flex-1">
                        <span>评论</span>
                        <span class="text-yellow text-14 MB-5" v-if="status != 1 && !isSelf">0</span>
                        <span class="text-yellow text-14 MB-5" v-else>{{statistics.comments || 0}}</span>
                    </li>
                    <li class="flex-row-column flex-1">
                        <span>点赞</span>
                        <span class="text-yellow text-14 MB-5" v-if="status != 1 && !isSelf">0</span>
                        <span class="text-yellow text-14 MB-5" v-else>{{statistics.likes || 0}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="article-list" v-if="postList.length && (status != 0 || status != 3 || status != 5)">
            <ul>
                <li 
                    class="flex-row-start article-item"
                    v-for="(item, index) in postList"
                    :key="index"
                    @click.stop="toPage('detail', item.id)"
                >
                    <span class="date MR-15 flex-row-start pos-relative" v-if="!item.dateline.today">
                        <span class="text-16 flex-1 text-center">{{item.dateline.value[0]}}</span>
                        <span class="text-12 text-666 flex-1 text-center ML-10">{{item.dateline.value[1]}}月</span>
                        <div class="line" :class="{ 'first-line': index === 0 }" v-if="index != postList.length - 1">
                            <span class="line-circle" v-if="index == 0"></span>
                        </div>
                    </span>
                    <span class="date MR-15 flex-row-start pos-relative" v-else>
                        <span class="text-16 flex-1 text-center">{{item.dateline.value[0]}}</span>
                        <span class="text-16 flex-1 text-center">{{item.dateline.value[1]}}</span>
                        <div class="line" :class="{ 'first-line': index === 0 }" v-if="index != postList.length - 1">
                            <span class="line-circle" v-if="index == 0"></span>
                        </div>
                    </span>
                    <div v-if="item.pics.length" class="flex-row-start flex-wrap">
                        <img lazy-load :src="item.pics[0]" class="article-item__img MR-15"/>
                    </div>
                    <text class="article-item__text text-15 word-break">{{item.message}}</text>
                </li>
            </ul>
            <end-line :status="loadStatus" v-if="!overLoad"></end-line>
        </div>
        <div v-else class="empty-list">
            <span class="text-darkGrey text-14">未发布任何动态</span>    
        </div>
        <!-- 底部按钮 -->
        <page-button :text="'+发布动态'" @click="toPage('publish')" v-if="isSelf && completeFlag"></page-button>
        <page-button :text="'+创建我的名片'" @click="toPage('edit')" v-if="!isSelf && status != 1"></page-button>
        <!-- 需要使用 button 来授权登录 -->
        <alert
            title="温馨提示"
            content="是否允许微信登录授权"
            is-wx-bind
            v-if="getAuthAlert"
            @right="getUserInfo"
            @close="setAuthAlert(false)">
        </alert>

        <!-- 分享弹框 -->
        <alert
            title="今日加好友名额已用完"
            content="获取新的名额?"
            share
            v-if="shareAlert"
            @right="share"
            @close="() => shareAlert = false">
        </alert>
    </div>
</template>

<script>
import { format2Time } from '@/utils/index.js'
import pageButton from '@/components/page-button/index.vue'
import endLine from '@/components/end-line/index.vue'
import alert from '@/components/alert/index.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    title: '我的名片',
    data() {
        return {
            // 用户的个人信息
            userInfo: {},                       
            // 数据统计
            statistics: {},                     
            // 判别自他
            isSelf: true,                       
            // 当前的动态页数
            curPage: 1,                         
            // 动态列表
            postList: [],                       
            // 当前用户是否已完成名片资料 0:未完善 1:已完善
            completeFlag: 0,                    
            // 用户主营的品牌列表
            userBrandImages: [],                
            // 登录用户的UID
            localUid: wx.getStorageSync('uid'), 
            // 他人名片的UID
            paramUid: '',                       
            // 登录用户的状态
            status: '',                         
            // 判断下拉加载数据是否全部加载
            overLoad: false,                    
            // 底线的状态 
            loadStatus: 1, 
            // 分享弹框是否显示
            shareAlert: false                     
        }
    },
    computed: {
		...mapGetters([
			'getAuthAlert'
		])
	},
    onLoad(options) {
        /**
         * 判断当前的名片是他人还是自己
         */
        this.paramUid = options.uid || ''
        if (this.localUid == this.paramUid) {
            this.toGetPersonProfile() // 获取自己的名片资料
        } else {
            this.isSelf = false
            this.toGetUserProfile()   // 获取其他用户的名片资料
        }
    },
    onShow() {
        try {
            this.userBrandImages = []
            if (this.isSelf) { // 如果当前名片是自身才会去查看本地的用户信息缓存
                this.toGetPerPostList(this.localUid)
                this.userInfo = wx.getStorageSync('userInfo') || {}
                if (!this.userInfo) {
                    throw new Error()
                } else {
                    this.userInfo.influence = Math.ceil(this.userInfo.influence)
                    this.userInfo.influence_per = Math.ceil(this.userInfo.influence_per * 100) || '0'
                    if (this.userInfo.main_brand_ids) {
                        this.userInfo.main_brand_ids.split(',').forEach(id => {
                            this.userBrandImages.push(this.userInfo.main_brand_pics[id].icon)
                        })
                    }
                    if (this.userBrandImages.length > 8) {
                       this.userBrandImages = this.userBrandImages.slice(0, 8)
                    }
                }
            } else {
                wx.setNavigationBarTitle({
                    title: '他的名片'
                })
                this.toGetPerPostList(this.paramUid)
            }
            this.status = this.$loginStatus
        } catch (err){
            console.error(`获取本地用户信息错误: ${error}`)
        }
    },
    components: {
        pageButton,
        endLine,
        alert
    },
    methods: {
		...mapActions([
			'setAuthAlert'
        ]),
        // 分享
        share() {
            this.$ajax('API.MembersCard.SharePost', {
                sharetype: 0
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
		 * 要用户进行授权
		 */
		getUserInfo (e) {
			this.$login({
				encryptedData: e.target.encryptedData,
				iv: e.target.iv
			})
		},
        /**
         * 获取个人名片的资料信息
         */
        toGetPersonProfile() {
            this.$ajax('API.MembersCard.PersonProfile').then(data => {
                if (data.status === 200) {
                    data.data.member.influence = Math.ceil(data.data.member.influence)
                    data.data.member.influence_per = Math.ceil(data.data.member.influence_per * 100) || '0'
                    this.userInfo = data.data.member
                    this.statistics = data.data.statistics
                    this.completeFlag = this.userInfo.complete_flag
                    if (this.userInfo.main_brand_ids && !this.userBrandImages.length) {
                        this.userInfo.main_brand_ids.split(',').forEach(id => {
                            this.userBrandImages.push(this.userInfo.main_brand_pics[id].icon)
                        })
                    }
                    if (this.userBrandImages.length > 8) {
                       this.userBrandImages = this.userBrandImages.slice(0, 8)
                    }
                    console.log(11)
                    // 把个人数据存储到本地的数据中
                    let storageData = {
                        avatar: this.userInfo.avatar,
                        city: this.userInfo.city,
                        company: this.userInfo.company,
                        complete_flag: this.userInfo.complete_flag,
                        influence: this.userInfo.influence,
                        influence_per: this.userInfo.influence_per,
                        main_brand_ids: this.userInfo.main_brand_ids,
                        main_brand_pics: this.userInfo.main_brand_pics,
                        member_types: this.userInfo.member_types,
                        mobile: this.userInfo.mobile,
                        tags: this.userInfo.tags,
                        title: this.userInfo.title,
                        username: this.userInfo.username
                    }
                    console.log(storageData)
                    wx.setStorageSync('userInfo', storageData)
                }
            })
        },
        /**
         * 获取其他用户的名片资料
         */
        toGetUserProfile() {
            this.$ajax('API.MembersCard.UserProfile', {
                uid: this.paramUid
            }).then(data => {
                if (data.status === 200) {
                    data.data.member.influence = Math.ceil(data.data.member.influence)
                    data.data.member.influence_per = Math.ceil(data.data.member.influence_per * 100) || '0'
                    this.userInfo = data.data.member
                    this.statistics = data.data.statistics
                    if (this.userInfo.main_brand_ids) {
                        this.userInfo.main_brand_ids.split(',').forEach(id => {
                           this.userBrandImages.push(this.userInfo.main_brand_pics[id].icon)
                        })
                        if (this.userBrandImages.length > 8) {
                            this.userBrandImages = this.userBrandImages.slice(0, 8)
                        }
                    }
                }
            })
        },
        /**
         * 获取个人动态列表
         * @param { Number } uid 个人用户ID
         */
        toGetPerPostList(uid) {
            let data = {
                uid,
                page: this.curPage
            }
            this.$ajax('API.MembersCard.PersonPost', data).then(data => {
                if (data.status === 200) {
                    for (let item of data.data) {
                        item.dateline = format2Time(item.dateline)
                    }
                    if (data.data.length < 10) {
                        this.overLoad = true
                        this.loadStatus = 2
                    }
                    this.postList = this.postList.concat(data.data)
                }
            })
        },
        /**
         * 跳转页面
         * @param { String } type 页面类型
         * @param { Number } cid  参数cid
         */
        toPage(type, cid) {
            let url = `/pages/${type}/main`
            if (cid) {
                url = `/pages/${type}/main?cid=${cid}`
            }
            wx.navigateTo({
                url
            })
        },
        /*
         * 添加好友请求
         */
        toAddFriend() {
            if(this.$checkAuth() && this.$checkLogin()) {
                this.$ajax('API.MembersCard.FollowFriend', {
                    friend_uid: this.paramUid
                }).then(data => {
                    if (data.status === 200) {
                        if (data.data.code === '01') {
                            wx.showToast({
                                title: '添加成功',
                                duration: 1500
                            })
                            this.toGetUserProfile()
                        // 超出添加上限
                        } else if (data.data.code === '05') {
                            this.shareAlert = true
                        } else {
                            wx.showToast({
                                title: data.data.msg,
                                duration: 1500
                            })
                        }
                    }
                })
            }
            
        }
    },
    /**
     * 微信分享的默认事件，必须
     */
    onShareAppMessage() {
        return {
            title: `${this.userInfo.username}的名片`
        }
    },
    /**
	 * 触底加载
	 */
	onReachBottom() {
        if (this.overLoad) return
        this.curPage++
        this.toGetPerPostList(this.paramUid)
	},
    onUnload() {
        this.isSelf = true
        this.userInfo = {}
        this.userBrandImages = []
        this.postList = []
    }
}
</script>