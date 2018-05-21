<style lang='less' scoped>
    .letter-list{
        position: fixed;
        right: 0;
        top: 0;
        height: 100%;
        z-index: 5;
        pointer-events:none;
        .letter-list__box{
            pointer-events:all;
        }
        .letter-list__item{
            width: 30px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            font-size: 28rpx;
            color: #666;
        }
        .letter{
            position: fixed;
            left: 50%;
            top: 50%;
            width: 50px;
            height: 50px;
            background: rgba(101, 164, 244, .6);
            color: #fff;
            border-radius: 50%;
        }
    }
</style>

<template>
    <div class="letter-list flex-column-center">
        <div 
        class="letter-list__box" 
        @touchstart="touchstart" 
        @touchmove.stop="tochMove" 
        @touchend="touchEnd">
            <div 
                class="letter-list__item" 
                :class="{'text-gold': index == letterIndex}"
                v-for="(item, index) in list"
                :key="index"
                @click="clickFn(index)">
                {{item}}
            </div>
        </div>
        <div class="letter flex-row-center" v-if="letterShow">
            {{list[letterIndex]}}
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce } from '@/assets/utils/index.js'
// 当前标题位置数组
let TITLE_ARR = null
// 定时器
let TIMER = null
let CLICK_TIMER = null
let ARR = []
export default {
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        },
        // 当前选中的字母
        key: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            // 当前选中字母是否显示
            letterShow: false,
            // 当前手指是否在字母列表上
            touch: false,
            letterIndex: 0
        }
    },
    computed: {
        ...mapGetters([
            'getLetterScrollTop'
        ]),
    },
    watch: {
        getLetterScrollTop(scrollTop) {
            if (this.isClick) {
                this.isClick = false
                return
            }
            if (this.touch) {
                return
            }
            this.getTitleScrollTop()
            if (!TITLE_ARR) {
                return
            }
            this.scrollFn(scrollTop, this)
            
        }
    }, 
    onUnload() {
        ARR = null
        TITLE_ARR = null
        CLICK_TIMER = null
        TIMER = null
        this.touch = false
        this.letterShow = false
        this.letterIndex = 0
    },
    methods: {
        scrollFn: debounce((scrollTop, $this) => {
            console.log(scrollTop, TITLE_ARR)
            let index = 0
            for (let i = 0, len = TITLE_ARR.length - 1; i <= len; i++) {
                let item = TITLE_ARR[i].top
                if ((scrollTop > item && scrollTop < TITLE_ARR[i+1].top) || scrollTop == item) {
                   index = i
                    break
                }else if (scrollTop >= TITLE_ARR[len].top) {
                   index = len
                    break
                }else if (scrollTop <= TITLE_ARR[0].top) {
                   index = 0
                    break
                }
            }
            $this.letterIndex = index
        }, 100),
        /**
         * 获取到标题的scrollTop
         */
        getTitleScrollTop() {
            if (TITLE_ARR) {
                return
            }
            let query  = wx.createSelectorQuery()
            let nodes = query.selectAll('.friend-title')
            nodes.fields({
                rect: true
            }, data => {
                TITLE_ARR = data               
            }).exec()
        },
        /**
         * 手指按下
         */
        touchstart(e) {
            this.touch = true
            ARR = []
            let curDom = e.currentTarget
            let wHeight = wx.getStorageSync('systemInfo').windowHeight
            this.list.forEach((item, index) => {
                ARR.push(index*18 + curDom.offsetTop)
            })
        },
        touchEnd() {
            this.touch = false
            this.$emit('change', null)
        },

        clickFn(index) {
            this.isClick = true
            this.letterChange(index)
        },

        //手指移动
        tochMove(e){ //  距离顶部的距离
            let result = e.touches[0].pageY
            let index = 0
            for (let i = 0, len = ARR.length; i < len; i++) {
                let item = ARR[i]
                if ((result > item && result < ARR[i+1]) || result == item) {
                    index = i
                    break
                }else if (result >= ARR[len - 1]) {
                    index = len - 1
                    break
                }else if (result <= ARR[0]) {
                    index = 0
                    break
                }
            }
            this.letterChange(index)
        },

         /**
         * 字母组件触发改变
         * @param {Number} index 当前索引
         */
        letterChange(index) {
            this.letterShow = true
            this.letterHide()
            if (this.letterIndex != index) {
                this.letterIndex = index
                this.$emit('change', index)
                setTimeout(() => {
                    this.$emit('change', null)
                }, 100)
                wx.vibrateShort()
            }
        },

        letterHide() {
            // 定时器
            TIMER && clearTimeout(TIMER)
            // 定时器
            TIMER = setTimeout(() => {
                this.letterShow = false
            }, 300)
        },
    }
}
</script>