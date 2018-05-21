<style lang='less' scoped>
.friend-title{
    padding-left: 20rpx;
    height: 60rpx;
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    background: #F2F2F2;
    z-index: 2;
    .friend-title__spot{
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #65A4F4;
    }
}
</style>

<template>
    <div class="friend-title text-666 flex-row-start text-14" :data-id="title">
        <div class="friend-title__spot MR-10"></div>
        {{title}}
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        }
    }
}
</script>