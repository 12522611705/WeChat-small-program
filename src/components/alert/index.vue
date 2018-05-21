<style lang='less' scoped>
.alert{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: rgba(0, 0, 0, .5);
    transition: all .3s;
    &.out{
        background: rgba(0, 0, 0, 0);
        .alert-content{
            transform: translateY(-100px);
            opacity: 0;
        }    
    }
    .alert-content{
        width: 260px;
        background: #fff;
        border-radius: 14px;
        transition: all .3s;
        .alert-info{
            padding: 20px 20px 30px;
            .alert-info__message .text-left{
                display: inline-block;
            }
        }
        .alert-btn__group{
            height: 40px;
            border-top: 1px solid #ccc;
            .alert-btn__item{
                flex: 1;
                width: 100%;
                line-height: 40px;
                text-align: center;
                font-size: 15px;
                position: relative;
                &:first-child{
                    border-right: 1px solid #ccc;
                    box-sizing: border-box;
                }
            }
        }
        .wx-button {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 2;
        }
    }
}
</style>

<template>
    <div class="alert flex-column-center" :class="{'out': out}">
        <div class="alert-content">
            <div class="alert-info">
                <div class="alert-info__title text-center MB-5 text-17">
                    {{title}}
                </div>
                <div class="alert-info__message text-666 text-14 text-center">
                    <p class="text-left">{{content}}</p>
                </div>
            </div>
            <div class="alert-btn__group flex-row-center">
                <div class="alert-btn__item text-sliver" v-if="!leftHide" @click="leftFn">{{leftMsg}}</div>
                <div class="alert-btn__item text-blue">
                    <span @click="rightFn">{{rightMsg}}</span>
                    <button v-if="isWxBind" class="wx-button" open-type="getUserInfo" @getuserinfo="rightFn"></button>
                    <button v-if="share" class="wx-button" open-type="share" @click="rightFn"></button>
                </div>
               
                
            </div>
        </div>
        
    </div>
</template>

<script>
// 定义定时器
let timer = null
export default {
    props: {
        // 左按钮文字
        leftMsg: {
            type: String,
            default: '取消'
        },
        // 右按钮文字
        rightMsg: {
            type: String,
            default: '确认'
        },
        // 左边按钮是否显示
        leftHide: {
            type: Boolean,
            default: false
        },
        // 提示内容
        content: {
            type: String
        },
        // 提示title
        title: {
            type: String
        },
        // 绑定微信登录
        isWxBind: {
            type: Boolean,
            default: false
        },
        // 当前是否需要分享
        share: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            out: true
        }
    },
    mounted() {
        timer = setTimeout(() => {
            this.out = false
        }, 100)
    },
    methods: {
        /**
         * 点击左按钮回调
         */
        leftFn() {
            this.close()
            this.$emit('left')
        },
        /**
         * 右按钮点击
         */
        rightFn(e) {
            e.preventDefault()
            this.close()
            this.$emit('right', e)
        },
        /**
         * 关闭弹框
         */
        close() {
            this.out = true
            timer = setTimeout(() => {
                this.$emit('close')
            }, 300)
        }
    },
    beforeDestroy() {
        timer && clearTimeout(timer)
    }
}
</script>