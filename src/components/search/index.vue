<style lang='less' scoped>
.search-box {
    padding: 16rpx 36rpx;
    background-color: #F8F8F8;
    .search-bar {
        border-radius: 100px;
        border: 1px solid #9ED1FA;
        box-shadow: 0 0 5px #9ED1FA;
        height: 70rpx;
        background: #fff;
        padding: 0 20rpx 0 30rpx;
    }
    .search-bar__input {
        width: 100%;
        flex: 1;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 28rpx;
    }
}

</style>

<template>
    <div class="search-box">
        <div class="search-bar flex-row-start" @click="clickFn">
            <icon 
            type="search" 
            size="14" 
            class="ML-10"/>
            <input 
                class="PL-10 search-bar__input"
                placeholder-class="placeholder"
                :placeholder="placeholder"
                :value="search"
                :disabled="disabled"
                :focus="focus"
                :maxlength="maxlength"
                :confirm-type="confirmTxt"
                @confirm.stop="keydown"
                @focus.stop="focusFn"
                @input="inputChange"/>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 占位文字
        placeholder: {
            type: String,
            default: '请输入搜索关键字'
        },
        // 搜索文字
        search: {
            type: String,
            default: ''
        },
        // 输入框限制长度
        maxlength: {
            type: [String, Number],
            default: 250
        },
        // 键盘右下键文字，同小程序配置
        confirmTxt: {
            type: String,
            default: 'done'
        },
        // 是否禁用搜索框
        disabled: {
            type: Boolean,
            default: false
        },
        // 是否自动获取焦点
        focus: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        inputChange(e) {
            this.$emit('input', e.target.value)
        },
        /**
         * 监听键盘事件
         */
        keydown(e) {
            this.$emit('confirm')
        },
        /**
         * 监听搜索框获取焦点
         */
        focusFn() {
            this.$emit('focus')
        },
        /**
         * 监听搜索框被点击
         */
        clickFn() {
            this.$emit('click')
        }
    }
}
</script>