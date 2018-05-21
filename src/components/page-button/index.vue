<style lang='less' scoped>
    .btn-footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
    }
</style>

<template>
    <div class="btn-footer" @click="listFn">
        <div class="text-17" :class="styles">{{text}}</div>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: 'String',
            require: true,
            default: ''
        },
        styles: {
            type: String,
            default: 'btn-blue'
        }
    },
    methods: {
        listFn() {
            this.$emit('click')
        }
    }
}
</script>