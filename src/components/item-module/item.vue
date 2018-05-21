<style lang='less' scoped>
.item{
    width: 150rpx;
    background: #EEEEEE;
    color: #666;
    font-size: 26rpx;
    text-align: center;
    border-radius: 40rpx;
    margin-right: 37rpx;
    margin-bottom: 30rpx;
    padding: 14rpx 8rpx;
    box-sizing: border-box;
    
    &:nth-of-type(4n){
        margin-right: 0;
    }
}
</style>

<template>
    <div class="item text-overflow__1" @click="clickFn">{{value}}</div>
</template>

<script>
export default {
    props: {
        // 当前显示的文字
        value: {
            type: String
        }
    },
    methods: {
        clickFn() {
            this.$emit('click')
        }
    }
}
</script>