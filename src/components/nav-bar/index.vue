<style lang='less' scoped>
.nav{
    background: #fff;
    height: 80rpx;
    .nav-item{
        flex: 1;
        width: 100%;
        position: relative;
        padding: 8px 10px;
        box-sizing: border-box;
        overflow: hidden;
        .nav-item__info{
            background: #F2F2F2;
            height: 60rpx;
            line-height: 60rpx;
            border-radius: 60rpx;
            font-size: 28rpx;
        }
    }
}
</style>

<template>
    <div class="nav flex-row-start height">
        <div 
            :key="index"
            :class="{'active': active == index}"
            class="nav-item text-center" 
            @click="toggleTab(index)"
            v-for="(item, index) in list">
            <div class="nav-item__info text-overflow__1">
                {{item.name}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 当前选中哪个tab
        index: {
            type: [String, Number],
            default: 0
        },
        list: {
            type: Array
        }
    },
    data() {
        return {
            // 当前选中的tab
            active: 0
        }
    },
    mounted() {
        this.active = +this.index
    },
    computed: {

    },
    watch: {

    },
    components: {

    },
    methods: {
        /**
         * 切换当前选中的tab
         * @param {Number} index 当前选中的tab
         */
        toggleTab(index){
            this.active = index
            this.$emit('change', index)
        }
    }
}
</script>