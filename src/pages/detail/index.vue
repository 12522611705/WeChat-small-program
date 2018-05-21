<style lang='less' scoped>
.article-detail {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .remark-member {
        margin-top: 10px;
        margin-left: 50px;
        padding: 10px;
        background-color: #f2f2f2;
		.member {
			margin-right: 10px;
        }
        .member-avatar {
            width: 20px;
            height: 20px;
            border-radius: 100%;
            vertical-align: top;
        }
    }
    .detail-comments {
        padding: 10px 15px 20px;
        border-top: 1px solid #eeeeee;
        .comment-avator__url {
            width: 40px;
            height: 40px;
            border-radius: 100%;
        }
        .comments-item {
            margin-bottom: 15px;
        }
        .comments-list {
            padding-left: 50px;
        }
    }
    .comment-input {
        text-align: left;
        margin:10px 15px;
    }
    ._action-sheet-item {
        padding: 0;
    }
}
</style>

<template>
    <div class="article-detail">
		<div class="MB-10 bg-white personal" v-if="detailData.username">
			<div class="PD-15">
                <!-- 个人信息 -->
                <info 
                    :username="detailData.username"
                    :avatar="detailData.avatar"
                    :dateline="detailData.dateline"
                    :company="detailData.company"
                    :work="detailData.title"
                    :uid="detailData.uid"
                    :isFriend="detailData.is_friend"
                >
                </info>
                <!-- 朋友圈内容 -->
                <contents
                    :message="detailData.message"
                    :pics="detailData.pics"
                    :likeLen="detailData.likes.length"
                    :commentLen="detailData.comments.length"
                    :isShare="true"
                    :isLike="detailData.isLike"
                    :postId="detailData.id"
                    @showComment="showComment"
                    @toUpdateLike="toUpdateLike"
                >
                </contents>
                <!-- 点赞列表 -->
                <div class="remark-member" v-if="detailData.likes.length">
                    <div class="flex-row-start">
                        <div class="member" v-for="(member, i) in detailData.likes" :key="i" @click.stop="toUserCard(member.uid)">
                            <img :src="member.avatar" class="member-avatar"/>
                        </div>
                    </div>
                </div>
			</div>
            <!-- 朋友圈评论 -->
            <div class="detail-comments" v-if="comments.length">
                <ul>
                    <li class="comments-item" v-for="(comment, j) in comments" :key="j">
                        <div class="flex-row-start flex-1">
                            <img lazy-load 
                                class="comment-avator__url" 
                                :src="comment.avatar" 
                                @click.stop="toUserCard(comment.uid)"
                            />
                            <div 
                                class="ML-10 flex-left flex-row-column"
                                @click.stop="toReplyUser(comment.username, comment.id, comment.uid)"
                            >
                                <span class="text-blue text-13">{{comment.username}}</span>
                                <span class="text-darkGrey text-12">{{comment.dateline}}</span>
                            </div>
                        </div>
                        <div class="comments-list text-13 flex-row-column flex-left">
                            <span>{{comment.comment}}</span>
                            <div v-if="reply[comment.id] && reply[comment.id].length">
                                <div v-for="(re, index) in reply[comment.id]" :key="index" class="word-break">
                                    <span class="text-blue">{{re.username}}</span>
                                    <span>&nbsp;回复&nbsp;</span>
                                    <span class="text-blue">{{re.replyname}}:&nbsp;</span>
                                    <span>{{re.comment}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
		</div>
        <action-sheet :hidden="isComment" @click.stop="toHiddenActionSheet" v-if="!isComment">
            <block> 
                <action-sheet-item @click.stop="toPrevent">
                    <div class="flex-row-start">
                        <input 
                            type="text" 
                            :placeholder="holder"
                            v-model="commentContent"
                            focus
                            confirm-type="send"
                            class="comment-input text-13 flex-1"
                            @confirm="toSendComment"
                        />
                    </div>
				</action-sheet-item>
            </block>
	    </action-sheet>
        <alert
            :title="'非好友只允许评论1次'"
            :content="'立即添加为好友?'"
            v-if="!isFriend"
            @right="toAddFriend"
            @close="closeAddFriend">
        </alert>
        
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
import { formatTime, utf16toEntities, uncodeUtf16 } from '@/utils/index.js'
import info from '@/components/index/info'
import contents from '@/components/index/content'
import comment from '@/components/index/comment'
import alert from '@/components/alert/index.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
	title: '详情',
	data () {
		return {
            detailData: {},
            comments: [],
            reply: {},            
            isComment: true,     // 是否从评论点击过来该页面
            commentContent: '',  // 评论输入的内容
            isFriend: true,
            holder: '评论',      //  默认回复框 placeholder    
            loginUid: wx.getStorageSync('uid'),
            isReply: false,      //  是否是对用户的回复操作
            commentId: '',
            replyUid: '',         // 对谁回复的用户ID
            alertShow: false       // 好友添加达到上限
		}
    },
    computed: {
        ...mapGetters([
            'getAuthAlert'
        ])
    },
    onLoad(options) {
        this.isComment = !options.comment
        this.$ajax('API.MembersCard.PostDetail', {
            post_id: options.cid
        }).then(data => {
            if (data.status === 200) {
                let comments = data.data.comments
                this.collageComment(comments)
                // 是否已经对当前的文章点赞
                let uid = wx.getStorageSync('uid')
                data.data.isLike = false
                data.data.likes.forEach(item => {
                    if (item.uid == uid) {
                        data.data.isLike = true
                    }
                })
                this.detailData = data.data
            }
        })
    },
	components: {
		info,
        contents,
        comment,
        alert
	},
  	methods: {
        ...mapActions([
            'setAuthAlert'
        ]),
        /**
         * 弹框确认回调
         */
        alertCall() {
            this.$ajax('API.MembersCard.SharePost', {
                sharetype: 1
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
         * 对接口返回的评论列表进行处理
         * @param { Array } comments
        */
        collageComment(comments) {
            let tempArray = []
            let reply = {}
            for(let comment of comments) {
                comment.comment = uncodeUtf16(comment.comment)
                if (comment.reply_id == '0') {
                    comment.dateline = formatTime(comment.dateline)
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
            this.comments = tempArray
            this.reply    = reply
        },
        /**
        * 点击点赞用户的头像跳转到该用户的名片页 
        * @param { Number } uid 用户ID
        */
        toUserCard(uid) {
            wx.navigateTo({
               url: `/pages/card/main?uid=${uid}`
            })
        },
        /**
         * 隐藏关闭回复窗口
         */
        toHiddenActionSheet() {
            this.isComment      = true
            this.isReply        = false
            this.commentContent = ''
        },
        toPrevent() {
            console.warn('阻止')
        },
        /**
         * 添加好友
         */
        toAddFriend() {
            if(this.$checkAuth() && this.$checkLogin()) {
                this.$ajax('API.MembersCard.FollowFriend', {
                    friend_uid: this.detailData.uid
                }).then(data => {
                    if (data.status === 200) {
                        if (data.data.code === '01') {
                            this.isFriend = true
                            this.toPutComment()
                        } else if (data.data.code === '05') {
                            this.alertShow = true
                        } else {
                            wx.showToast({
                                title: '好友添加失败',
                                icon: 'none'
                            })
                        }
                    }
                })
            }
            
        },
        closeAddFriend() {
            this.isFriend = true
        },
        /**
         * 发布评论了 toSendComment -> toPutComment
         */
        toSendComment() {
            if (this.detailData.is_friend == 0) {
                this.isFriend = false
            } else {
                if (!this.commentContent) {
                    wx.showToast({
                        icon: 'none',
                        title: '请输入评论内容'
                    })
                } else {
                    this.toPutComment()
                }
            }
        },
        toPutComment() {
            let data = {
                post_id: this.detailData.id
            }
            if (this.isReply) {
                data.comment_id = this.commentId
                data.reply_uid  = this.replyUid
            }
            data.comment = utf16toEntities(this.commentContent)
            this.$ajax('API.MembersCard.CommentPost', data).then(data => {
                if (data.status === 200) {
                    this.commentContent = ''
                    this.isComment = true
                    if (data.data.code == '01') {
                        wx.showToast({
                            title: '评论成功',
                            duration: 1500
                        })
                        this.toUpdateLike(this.detailData.id) // 更新数据
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: data.data.msg,
                            duration: 1500
                        })
                    }
                }
            })
        },
        /**
         * 在详情页点击评论的按钮触发这个事件
         */
        showComment() {
            if (this.loginUid == this.detailData.uid) {
                wx.showToast({
                    icon: 'none',
                    title: '不允许对自己进行回复!'
                })
                return
            }
            this.holder    = `评论`
            this.isComment = false
            this.isReply   = false
        },
        /**
         * 对评论的用户进行回复
         * @param { String } replyName 对谁回复
         * @param { String } commentId 回复的评论ID
         * @param { String } replyUid  对谁回复的用户ID
         */
        toReplyUser(replyName, commentId, replyUid) {
            if (this.loginUid == replyUid) {
                wx.showToast({
                    icon: 'none',
                    title: '不允许对自己进行回复!'
                })
                return
            }
            this.holder    = `回复 ${replyName}:`
            this.isComment = false
            this.isReply   = true
            this.commentId = commentId
            this.replyUid  = replyUid
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
                    data.data.likes.map(like => {
                        if (like.uid == this.loginUid) {
                            isLike = true
                        }
                    })
                    this.detailData.isLike = isLike
                    this.detailData.likes = data.data.likes
                    this.collageComment(data.data.comments)
                }
            })
        }
    },
    onUnload() {
        this.detailData = {}
        this.comments   = []
        this.reply      = {}
    },
        /**
     * 微信的分享
     */
    onShareAppMessage(res) {    
        return {
            title: `${this.detailData.username}的名片`
        }
    }
}
</script>