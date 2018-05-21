<style lang='less' scoped>
.article-plaza {
    padding-bottom: 100rpx;
}
</style>

<template>
    <div class="article-plaza">
		<div class="bg-white personal" :class="{ 'MB-10': index != postList.length - 1 }" v-for="(item, index) in postList" :key="index">
			<div class="PD-15">
                <!-- 个人信息 -->
                <info
                    :username="item.username"
                    :avatar="item.avatar"
                    :dateline="item.dateline"
                    :company="item.company"
                    :work="item.title"
                    :isFriend="item.is_friend"
                    :uid="item.uid"
                ></info>
                <!-- 朋友圈内容 -->
                <contents
                    :pics="item.pics"
                    :message="item.message"
                    :likeLen="item.likes.length"
                    :commentLen="item.comments.length"
                    :postId="item.id"
                    :isLike="item.isLike"
                    @toUpdateLike="toUpdateLike"
                ></contents>
			</div>
            <!-- 朋友圈评论 -->
            <comment
                :postId="item.id"
                :likes="item.likes" 
                :comments="item.comments"
            ></comment>
		</div>
        <end-line :status="status"></end-line>
	</div>
</template>

<script>
import endLine from '@/components/end-line/index.vue'
import info from './info'
import contents from './content'
import comment from './comment'
import { mapGetters, mapActions } from 'vuex'
export default {
    props: {
        loadMore: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            loginUid: wx.getStorageSync('uid'),  // 当前登录的用户ID
            curPage: 1,   // 当前页数
            postList: [], // 朋友圈动态列表
            status: 1,    // 加载更多数据
            overLoad: false, // 是否已经加载完所有的数据
            reFlesh: false,  // 是否是上拉的刷新操作
        }
    },
    onLoad() {
        this.toGetPostList()
    },
    mounted() {
        this.$on('refresh', () => {
            this.reFlesh  = true
            this.curPage  = 1
            this.status   = 1
            this.postList = []
            this.overLoad = false
            this.toGetPostList(false)
        })
    },
    events: {
        
    },
    computed: {
        ...mapGetters([
            'getPublishStatus'
        ])
    },
    watch: {
        loadMore(value) {
            if(value) {
                if (!this.overLoad) {
                    this.curPage++
                    this.toGetPostList(false)
                }
            }
        },
        getPublishStatus(value) {
            if (value) {
                this.postList = []
                this.curPage = 1
                this.toGetPostList()
                this.setPublishStatus(false)
            }
        }
    },
    components: {
        info,
        contents,
        comment,
        endLine
    },
    methods: {
        ...mapActions([
            'setPublishStatus'
        ]),
        /**
		 * 获取朋友圈动态
         * @param { Boolean } true 是否显示loading
		 */
        toGetPostList(load = true) {
			this.$ajax('API.MembersCard.PostList', {
                page: this.curPage,
                load
			}).then(data => {
				if (data.status === 200) {
                    if (this.reFlesh) {
                        this.reFlesh = false
                        wx.stopPullDownRefresh()
                    }
                    let result = data.data
                    this.toComputedLike(result)
				}
			})
        },
        /**
         * 计算动态的点赞情况
         * @param { Array } result 动态数据列表
         */
        toComputedLike(result) {
            if (typeof result === 'object' && !(result instanceof Array)) {
                this.overLoad = true
                this.status = 2
                return
            } 
            for (let item of result) {
                let isLike = false
                item.likes.map(like => {
                    if (like.uid == this.loginUid) {
                        isLike = true
                    }
                })
                item.isLike = isLike
            }
            if (result.length < 10) {
                this.overLoad = true
                this.status = 2
            }
            this.postList = this.postList.concat(result)
        },
        /**
         * 更新点赞状态
         * @param { Number } postId 文章ID
         */
        toUpdateLike(postId) {
            this.$ajax('API.MembersCard.PostDetail', {
                post_id: postId,
                load: false
            }).then(data => {
                if (data.status === 200) {
                    let isLike = false
                    this.postList.forEach(post => {
                        if (postId == post.id) {
                            data.data.likes.map(like => {
                                if (like.uid == this.loginUid) {
                                    isLike = true
                                }
                            })
                            post.isLike = isLike
                            post.likes = data.data.likes
                        }
                    })
                }
            })
        }
    }
}
</script>