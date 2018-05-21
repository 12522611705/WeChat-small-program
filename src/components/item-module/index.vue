<style lang='less' scoped>
.item-module{
    background: #fff;
}
.item-module__title{
    height: 80rpx;
    line-height: 80rpx;
    padding-left: 20rpx;
    border-bottom: 1px solid #eee;
}
.item-module__content{
    padding: 30rpx 20rpx 0;
    flex-wrap: wrap;
}
</style>

<template>
    <div class="item-module MB-20">
        <div class="item-module__title text-16">{{name}}</div>
        <div class="item-module__content flex-row-start">
            <item 
                :value="item[keyName]" 
                v-for="(item, key) in list" 
                :key="key"
                @click="clickFn(item)">
            </item>
        </div>
    </div>
</template>

<script>
import item from './item.vue'
export default {
    props: {
        // 当前模块名字
        name: {
            type: String
        },
        // 当前模块下面的数据
        list: {
            type: Array
        },
        // 显示的字段名
        keyName: {
            type: String
        },
        // 当前模块索引
        index: {
            type: Boolean
        }
    },
    components: {
        item
    },
    methods: {
        /**
         * 点击了某个子类
         * @param {Number} index 当前索引
         */
        clickFn(item) {
            this.$emit('handler', item, this.index)
        }
    }
}
</script>