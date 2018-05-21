<style lang='less' scoped>
    .personal-content {
		margin-top: 20rpx;
		padding-left: 100rpx;
		.type-text {
            margin-bottom: 20rpx;
            word-wrap:break-word;
		}
		.type-img {
            width: 100%;
            margin-bottom: 20rpx;
		}
		.more-img {
			img {
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				width: 180rpx;
				height: 180rpx;
				vertical-align: top;
            }
            .last-img {
                margin-right: 0rpx;
            }
            .four-img {
                width: 280rpx;
				height: 280rpx;
            }
        }
        .up-sanjiao {
            position: absolute;
            left: 0;
            top: 15px;
            border-style: solid;
            border-color: transparent transparent #f2f2f2 transparent;
            border-width: 10px;
        }
        .btn-share {
            width: 20px;
            height: 20px;
            padding: 0;
            left: 0;
            top: 0;
            opacity: 0;
            &:after {
                border: none;
            }
        }
	}
</style>

<template>
    <div class="personal-content">
        <div class="type-text text-14">{{message}}</div>
        <!-- 仅有一张图片 -->
        <div v-if="pics.length === 1">
            <img
                lazy-load
                mode="widthFix"
                :src="pics[0]"
                class="type-img"
                @click.stop="toPreviewImage(pics, 0)"
            />
        </div>
        <!-- 仅有2-3张图片 -->
        <div v-if="pics.length > 1 && pics.length <= 3" class="more-img">
            <img
                lazy-load
                mode="widthFix"
                :src="img" v-for="(img, index) in pics"
                :key="index"
                :class="{ 'last-img': index == 2 }"
                @click.stop="toPreviewImage(pics, index)"
            />
        </div>
        <!-- 仅有4张图片 -->
        <div v-if="pics.length === 4" class="more-img">
            <img
                lazy-load
                :src="img"
                mode="widthFix"
                v-for="(img, index) in pics"
                :key="index"
                :class="['four-img', { 'last-img': index%2 }]"
                @click.stop="toPreviewImage(pics, index)"
            />
        </div>
        <!-- 大于4张图片 -->
        <div v-if="pics.length > 4" class="more-img">
            <img
                lazy-load
                :src="img"
                mode="widthFix"
                v-for="(img, index) in pics"
                :key="index"
                :class="{ 'last-img': (index+1) % 3 == 0 }"
                @click.stop="toPreviewImage(pics, index)"
            />
        </div>
        <div class="flex-row-end text-15">
            <div class="flex-row-start text-gray" @click.stop="toLike">
                <div class="iconfont MR-3 icon-blue text-20 pos-relative" :class="{ 'icon-dianzanhou': isLike, 'icon-xihuan': !isLike }">
                    <div class="up-sanjiao" v-if="isShare"></div>
                </div>
                {{likeLen}}
            </div>
            <div class="flex-row-start text-gray ML-10" @click.stop="toComment">
                <i class="iconfont icon-pinglun1 MR-3 icon-blue text-20"></i>{{commentLen}}
            </div>
            <div class="ML-10 pos-relative" v-if="isShare">
                <button class="btn-share pos-absolute text-14" open-type="share"></button>
                <i class="iconfont icon-fenxiang icon-blue text-20" ></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 发布的图片内容
        pics: {
            type: Array,
            default: []
        },
        // 发布的文字内容
        message: {
            type: String,
            default: ''
        },
        // 点赞数
        likeLen: {
            type: Number,
            default: 0
        },
        // 评论数
        commentLen: {
            type: Number,
            default: 0
        },
        // 是否开始分享功能
        isShare: {
            type: Boolean,
            default: false
        },
        // 文章ID
        postId: {
            type: [Number, String]
        },
        // 是否点赞
        isLike: {
            type: Boolean,
            default: false
        },
        showComment: {
            type: Function
        }
    },
    methods: {
        /**
         * 对文章进行点赞，不可逆，只能点赞一次，作者可以点赞自己的文章 
         */
        toLike() {
            if(this.$checkAuth()) {
				if(this.$checkLogin()) {
                    if (this.isLike) return
                    this.$ajax('API.MembersCard.LikePost', {
                        post_id: this.postId,
                        load: false
                    }).then(data => {
                        if (data.status === 200) {
                            if (data.data.code === '01') {
                                // 点赞成功后更新当前文章的点赞状态
                                this.$emit('toUpdateLike', this.postId)
                            }
                        }
                    })
				}
			}
        },
        /**
         * 去详情页 - 评论文章  
         */
        toComment() {
            if(this.$checkAuth()) {
				if(this.$checkLogin()) {
                    let pages = getCurrentPages()
                    let currentPageRoute = pages[pages.length - 1].route
                    if (currentPageRoute.indexOf('/detail/main') > -1) {
                        this.$emit('showComment')
                    } else {
                        wx.navigateTo({
                            url: `/pages/detail/main?cid=${this.postId}&comment=true`
                        })
                    }
				}
			}
        },
        /**
         * 预览图片
         * @param {String} url 图片的地址
         */
        toPreviewImage(pics, index) {
            wx.previewImage({
                urls: pics,
                current: pics[index]
            })
         }
    }
}
</script>