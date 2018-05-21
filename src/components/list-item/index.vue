<style lang='less' scoped>
.list{
    padding: 20rpx 30rpx;
    background: #fff;
    border-bottom: 1px solid #EEEEEE;
    .list-left{
        flex: 1;
        width: 100%;
    }
    .left-icon{
        margin-top: -6rpx;
    }
}
</style>

<template>
    <div class="list flex-row-between" @click="listFn">
        <div class="text-16 text-overflow__1 list-left">
            <span
            class="iconfont text-blue text-20 MR-5 left-icon" 
            :class="[leftIcon]"
            v-if="leftIcon">
            </span>
            {{value}}
        </div>
        <div class="text-sliver text-14" v-if="rightName || !hideRightIcon" @click.stop="rightFn">
            <template v-if="rightName">{{rightName}}</template>
            <span v-if="!hideRightIcon" class="text-14 iconfont icon-youjiantou ML-5"></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 左边icon
        leftIcon: {
            type: String,
            default: ''
        },
        // 当前行内容
        value: {
            type: String,
            default: ''
        },
        // 右边文字
        rightName: {
            type: String,
            default: ''
        },
        hideRightIcon: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        /**
         * 触发右边按钮
         */
        rightFn() {
            this.$emit('right')
        },
        /**
         * 点击当前这一行
         */
        listFn() {
            this.$emit('click')
        }
    }
}
</script>