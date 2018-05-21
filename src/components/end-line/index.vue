<style lang='less' scoped>
    .end-line {
        text-align: center;
        color: #999;
        @keyframes donut-spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        .donut {
            display: inline-block;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #65A4F4;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            animation: donut-spin 1.2s linear infinite;
        }
    }
</style>

<template>
    <div class="end-line PB-10 PT-10 text-13">
        <div class="loading" v-if="status == 1">
            <span class="donut"></span>
        </div>
        <div v-if="status == 2">我也是有底线的</div>
    </div>
</template>

<script>
export default {
    props: {
        // 当前状态 1：加载中 2：没有更多
        status: {
            type: [Number, String],
            default: 1
        }
    }
}
</script>