<style lang='less' scoped>
    .personal-info {
		.info-avator__url {
			width: 80rpx;
			height: 80rpx;
			background-size: cover;
			border-radius: 100%;
		}
		.friend {
			padding: 2rpx 16rpx;
			color: #fff;
			background-color: #F5A623;
			border-radius: 20rpx;
		}
		.info-time {
			width: 100%;
		}
	}
</style>

<template>
    <div class="personal-info flex-row-between">
        <div class="flex-row-start flex-1">
            <img lazy-load class="info-avator__url" :src="avatar" @click.stop="toUserCard"/>
            <div class="ML-10 flex-left flex-1" :class="company || work ? 'flex-row-column' : 'flex-row-start' ">
                <div class="flex-row-start">
                    <span>{{username}}</span>
                    <span class="ML-5 friend text-10" v-if="isFriend == '1'">好友</span>
                </div>
                <div class="flex-row-between flex-1 info-time">
                    <span class="text-sliver text-13">{{company + work}}</span>
                    <span class="text-darkGrey text-12" v-if="date">{{date}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatTime } from '@/utils/index.js'
export default {
	props: ['username', 'avatar', 'dateline', 'company', 'work', 'isFriend', 'uid'],
	data() {
		return {
			date: ''
		}
	},
	created() {
		this.date = formatTime(this.dateline)
	},
	methods: {
		/**
			点击用户的头像跳转到用户的名片页
		 */
		toUserCard() {
			if(this.$checkAuth()) {
				if(this.$checkLogin()) {
                    wx.navigateTo({
						url: `/pages/card/main?uid=${this.uid}`
					})
				}
			}
		}
	}
}
</script>