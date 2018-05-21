<style lang='less' scoped>
    .comment {
		border-top-width: 1px;
		border-top-style: solid;
		padding: 20rpx 30rpx 20rpx 130rpx;
		.comment__li {
			padding-bottom: 10rpx;
		}
	}
</style>

<template>
    <div class="comment border-gray text-14" v-if="comment.length">
        <ul>
            <li class="comments-item MB-3" v-for="(item, index) in comment" :key="index">
                <div class="comments-list flex-row-column flex-left">
                    <div>
                        <span class="text-blue" @click.stop="toPage('card', item.uid)">
                            {{item.username}}: 
                        </span>
                        <span>{{item.comment}}</span>
                    </div>
                    <div v-if="reply[item.id] && reply[item.id].length">
                        <div v-for="(re, i) in reply[item.id]" :key="i" class="word-break MB-3">
                            <span class="text-blue" @click.stop="toPage('card', item.uid)">{{re.username}}</span>
                            <span>&nbsp;回复&nbsp;</span>
                            <span class="text-blue" @click.stop="toPage('card', item.uid)">{{re.replyname}}: </span>
                            <span>{{re.comment}}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="text-blue MT-10" v-if="comments.length > 3" @click.stop="toPage('detail')">
            查看全部{{comments.length}}条评论
        </div>
    </div>
</template>

<script>
export default {
    props: ['likes', 'comments', 'postId'],
    data() {
        return {
            reply: [],   // 经过处理后的回复内容
            comment: [], // 经过处理后的评论内容
        }
    },
    created() {
        // 取前三条数据进行处理
        this.advanceHandle()
    },
    methods: {
        advanceHandle() {
            let limitComment = this.comments.slice(0, 3)
            this.collageComment(limitComment)
        },
        /**
         * 对评论的数据列表进行进一步的处理
         * @param { Array } comments 要处理的评论数据
         */
        collageComment(comments) {
            let tempArray = []
            let reply = {}
            for(let comment of comments) {
                if (comment.reply_id == '0') {
                    tempArray.push(comment)
                } else {
                    let flag = false
                    Object.keys(reply).forEach(item => {
                        reply[item].forEach((re, index) => {
                            if (comment.reply_id == re.id) {
                                flag = true
                                reply[re.reply_id].splice(index + 1, 0, comment)
                            }
                        })
                    })
                    if (!flag) {
                        if (!reply[comment.reply_id]) {
                            reply[comment.reply_id] = []
                        }
                        reply[comment.reply_id].push(comment)
                    }
                }
            }
            this.comment = tempArray
            this.reply    = reply
        },
        /**
         * 显示全部的评论
         */
        toPage(type, uid) {
            let url = ''
            if (uid) {
                url = `/pages/${type}/main?uid=${uid}`
            } else {
                url = `/pages/detail/main?cid=${this.postId}`
            }
            wx.navigateTo({
               url
            })
        }
    }
}
</script>