<style lang='less' scoped>
.friend-item{
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
        &.disabled {
            background:#E5E5E5;
            border-color: #E5E5E5;
            color:#aaa;
        }         
    }
}
</style>

<template>
    <div class="friend-item flex-row-start" @click="clickFn">
        <div class="friend-avater MR-20" @click.stop="avatarClick">
            <img class="avater-img" :src="avatar || defaultAvatar" mode="widthFix"/>
        </div>
        <div class="friend-info">
            <div class="text-16">{{title}}</div>
            <div class="text-overflow__1 text-14 text-666">{{lineOne}}</div>
            <div class="text-overflow__1 text-666 text-14">{{lineTwo}}</div>
        </div>
        <div class="btn btn-blue-line friend-btn ML-20" :class="{'disabled': btnDisabled}" v-if="btn" @click.stop="btnClick">
            {{btn}}
        </div>
    </div>
</template>

<script>
import avatar from '@/assets/images/default.png'
export default {
    props: {
        // 头像
        avatar: {
            type: String
        },
        // 第一行title
        title: {
            type: String,
        },
        // 第一行文字
        lineOne: {
            type: String
        },
        // 第二行文字
        lineTwo: {
            type: String
        },
        // 按钮文字
        btn: {
            type: String
        },
        // 按钮是否禁用
        btnDisabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            defaultAvatar: avatar
        }
    },
    methods: {
        /**
         * 点击按钮
         */
        btnClick() {
            this.$emit('btn')
        },
        /**
         * 点击头像
         */
        avatarClick() {
            this.$emit('avatar')
        },
        /**
         * 点击当前这列
         */
        clickFn() {
            this.$emit('click')
        }
    }
}
</script>