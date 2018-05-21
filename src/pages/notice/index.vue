<style lang="less" scoped>
.container {
	position: relative;
	width: 100%;
	height:100%;
	background-color: #ffffff;
	.empty-tip {
		.tip-pic {
			margin: 80px 0px;
			width: 107px;
			height: 107px;
			background: url(../../assets/images/empty@2x.png) no-repeat;
			background-size: 100%;
			object-fit: cover;
		}
	}
}
.notice-list {
	padding-bottom: 60px;
	.list-item {
		padding: 20rpx 30rpx;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		.list-item__avator {
			width: 80rpx;
			height: 80rpx;
			border-radius: 100%;
			vertical-align: top;
		}
		.list-item__img {
			width: 120rpx;
			height: 120rpx;
			vertical-align: top;
		}
		.flex-width {
			width: 215px;
		}
	}
}
</style>
<template>
  	<div class="container">
		<div class="notice-list bg-white">
			<ul v-if="noticeList.length">
				<li v-for="(item, index) in noticeList" :key="index" @click.stop="toPage('detail', item.id)">
					<div class="flex-row-between list-item border-gray">
						<div class="flex-row-start">
							<img :src="item.avatar || avatarPic" class="list-item__avator" @click.stop="toPage('card', item.follow_uid)"/>
							<div class="ML-10 flex-column-start flex-1 flex-width">
								<div class="text-15">{{item.username}}</div>
								<div class="PT-5 PB-5 remark text-13 text-overflow__2">
									{{
										item.type == 4 ? item.content :
										item.type == 3 ? '刚刚点赞了你的动态' : 
										item.type == 2 ? item.content : "刚刚转发了你的动态"
									}}
								</div>
								<div class="text-11 text-darkGrey">{{item.dateline}}</div>
							</div>
						</div>
						<img :src="item.content_pic" class="list-item__img"/>
					</div>
				</li>
			</ul>
			<div v-else class="empty-tip flex-column-center">
				<div class="tip-pic"></div>
				<span class="text-666 text-sliver">矮油~暂时没有新的动态</span>
			</div>
			<end-line :status="status" v-if="noticeList.length"></end-line>
		</div>
		<foot-bar></foot-bar>
	</div>
</template>

<script>
import { formatTime, uncodeUtf16 } from '@/utils/index.js'
import endLine from '../../components/end-line/index.vue'
import footBar from '../../components/foot-bar/index.vue'
import avatarPic from '@/assets/images/default.png'
export default {
	title: '消息',
	data () {
		return {
			status: 1,
			overLoad: false,
			curPage: 1, 		 // 页数
			noticeList: [],		 // 消息列表 
			avatarPic
		}
	},
	onShow () {
		this.toGetChatList()
	},
	components: {
		endLine,
		footBar
	},
  	methods: {
		/**
		 * 获取消息列表 
		 */  
		toGetChatList () {
			this.$ajax('API.MembersCard.noticeList',{
				page: this.curPage
			}).then(data => {
				if (data.status === 200) {
					if (typeof data.data === 'object' && !(data.data instanceof Array)) {
						this.overLoad = true
						return
					}
					for (let item of data.data) {
						item.content = uncodeUtf16(item.content)
					}
					if (data.data.length < 10) {
						this.overLoad = true
						this.status   = 2
					}
					this.noticeList = this.noticeList.concat(data.data)
				}
			})
		},
		/**
		 * 打开一个新的页面 toPage
		 * @param {String} type 页面类型
		 */
		toPage(type, id) {
			let url = ''
			if (type === 'card') {
				url = `/pages/${type}/main?uid=${id}`
			} else {
				url = `/pages/${type}/main?cid=${id}`
			}
			wx.navigateTo({
				url
			})
		}
	},
	/**
	 * 触底加载
	 */
	onReachBottom() {
		if (this.overLoad) return
		this.curPage++
		this.toGetChatList()
	},
	onUnload() {
		this.noticeList = []
		this.curPage = 1
		this.status = 1
		this.overLoad = false
	}
}
</script>