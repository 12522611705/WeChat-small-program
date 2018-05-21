<style lang="less" scoped>
.userinfo {
	width: 100%;
	height: 344rpx;
	position: relative;
	background: #65A4F4;
	.bg-image {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	.userinfo-inner {
		position: relative;
		z-index: 2;
		height: 100%;
	}
	.userinfo-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.userinfo-nickname {
		font-size: 16px;
		color: #fff;
	}
	.influence {
		margin-top: 10rpx;
		color: #fff;
	}
	.my-info {
		margin-bottom: 24px;
	}
	.my-publish {
		margin-bottom: 24px;
		width: 210rpx;
		height: 70rpx;
		border-top-right-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.35);
	}
	.my-card {
		margin-bottom: 24px;
		width: 210rpx;
		height: 70rpx;
		border-top-left-radius: 40rpx;
		border-bottom-left-radius: 40rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.35);
	}
}
</style>
<template>
  <div class="container">
    <div class="userinfo">
		<div class="flex-row-start userinfo-inner flex-end">
			<div class="my-publish flex-row-center" @click.stop="toPage('publish')">
				<i class="iconfont icon-pengyouquan MR-5 text-20"></i>
				<span class="MR-10 text-14">发布动态</span>
			</div>
			<div class="my-info flex-row-column flex-1">
				<img class="userinfo-avatar" :src="userInfo.avatar || avatarPic" background-size="cover" />
				<span class="userinfo-nickname PT-5 text-18">{{userInfo.username || '某某某'}}</span>
				<span class="influence text-12">
					影响力&nbsp;
					<span class="text-yellow">{{userInfo.influence || 0}}</span>
				</span>
			</div>
			<div class="my-card flex-row-center" @click.stop="toPage('card')">
				<span class="ML-5 text-14">我的名片</span>
				<i class="iconfont icon-youjiantou text-12 ML-5 text-15"></i>
			</div>
		</div>
    </div>

	<!-- 热门榜 -->
	<hot ref="hot"></hot>

    <!-- 朋友圈文章广场-->
	<plaza
		ref="plaza"
		:loadMore="loadMore"
	></plaza>

	<foot-bar @card="toPage('card')"></foot-bar>

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
import avatarPic from '@/assets/images/default.png'
import cardBg from '@/assets/images/card_bg.png'
import footBar from '@/components/foot-bar/index.vue'
import plaza from '@/components/index/plaze.vue'
import hot from '@/components/index/hot.vue'
import alert from '@/components/alert/index.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
	title: '',
	data () {
		return {
			code: '', // 微信的临时登录凭证
			userInfo: {}, // 用户的当前信息体
			cardBgPic: cardBg, // 背景图片
			status: '', // 登录状态
			uid: '',    // 当前用户的UID
			loadMore: 0,
			avatarPic: avatarPic
		}
	},
	mounted () {
		this.toGetUserScrip()
	},
	onShow() {
		try {
            this.userInfo = wx.getStorageSync('userInfo') || {}
            if (!this.userInfo) {
                throw new Error()
            }
        } catch (err){
            console.error(`获取本地用户信息错误: ${error}`)
        }
	},
	computed: {
		...mapGetters([
			'getAuthAlert'
		])
	},
	components: {
		footBar,
		plaza,
		hot,
		alert
	},
  	methods: {
		...mapActions([
			'setAuthAlert'
		]),
		/**
		 * 获取用户登录的临时凭证
		 * 首先调起wx.login获取临时登录凭证
		*/
		toGetUserScrip() {
			this.$login().then(res => {
				this.toHandleInfo(res)
			})
		},
		/**
		 * 要用户进行授权
		 */
		getUserInfo (e) {
			this.$login({
				encryptedData: e.target.encryptedData,
				iv: e.target.iv
			}).then(res => {
				this.toHandleInfo(res)
			})
		},
		/**
		 * 授权后处理用户的数据
		 * @param { Object } res
		 */
		toHandleInfo(res) {
			if (this.$loginStatus === 1 || this.$loginStatus === 3 || this.$loginStatus === 5) {
				// 页面用户的个人信息
				this.userInfo = {
					avatar: res.avatar,
					username: res.username,
					influence: Math.ceil(res.influence)
				}
				// 用户的UID
				this.uid = res.uid
			}
		},
		/**
		 * 打开一个新的页面 toPage
		 * @param {String} type 页面类型
		 */
		toPage(type) {
			if(this.$checkAuth() && this.$checkLogin()) {
				let url = `/pages/${type}/main`
				if (type === 'card') {
					url = `${url}?uid=${this.uid}`
				}
				wx.navigateTo({
					url: url
				})
			}
		}
	},
	/**
	 * 触底加载
	 */
	onReachBottom() {
		this.loadMore++
	},
	/**
	 * 下拉刷新
	 */
	onPullDownRefresh() {
		this.loadMore = 0
		this.toGetUserScrip(false)
		this.$refs.hot.$emit('refresh')
		this.$refs.plaza.$emit('refresh')
	}
}
</script>