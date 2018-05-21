<style lang='less' scoped>
    .verify-mobile {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        overflow: hidden;
        .tag-img {
            margin: 70px auto 30px;
            width: 118rpx;
            height: 118rpx;
            background: url(../../assets/images/tel@2x.png) no-repeat;
            background-size: 100%;
        }
        .title {
            padding: 20rpx 0rpx;
            text-align: center;
        }
        ul {
            padding: 0rpx 74rpx;
            margin-top: 40rpx;
        }
        li {
            margin-bottom: 40rpx;
            padding: 20rpx 0rpx;
            border-bottom: 1px solid #ccc;
            input {
                margin-top: 1px;
            }
        }
        .btn-get-code {
            right: 14rpx;
            padding:12rpx 20rpx;
            border-radius:200rpx;
        }
    }
</style>

<template>
    <div class="verify-mobile">
        <div class="tag-img"></div>
        <div class="title text-14 text-666">为了验证身份，请输入常用手机号码</div>
        <ul>
            <li class="flex-row-start">
                <i class="iconfont icon-shoujihao icon-blue text-20"></i>
                <span class="ML-5 text-14">手机号</span>
                <input type="text" v-model="mobile" placeholder="请输入手机号码" class="ML-10 text-13"/>
            </li>
            <li class="flex-row-start pos-relative">
                <i class="iconfont icon-yanzhengma icon-blue text-20"></i>
                <span class="ML-5 text-14">验证码</span>
                <input type="text" v-model="code" placeholder="请输入验证码" class="ML-10 text-13"/>
                <span class="text-13 btn-get-code pos-absolute" :class="flag ? 'btn-gray' : 'btn-blue'" @click.stop="toGetMobileCode">
                    {{flag ?  second + 'S'  : '获取验证码'}}
                </span>
            </li>
        </ul>
        <!-- 底部按钮 -->
        <page-button :text="'验证'" @click="toVerifyMobile"></page-button>
    </div>
</template>

<script>
import pageButton from '@/components/page-button/index.vue'
export default {
    title: '验证手机号码',
    data() {
        return {
            reg: /^1[34578]\d{9}$/,
            mobile: '',
            code: '',
            flag: false,
            timer: null,
            second: 60
        }
    },
    components: {
        pageButton
    },
    methods: {
        // 触发获取验证码
        toGetMobileCode() {
            if (!this.reg.test(this.mobile)) {
                wx.showToast({
                    title: '请输入正确的手机号码',
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            if (this.flag) return
            this.flag = true
            this.second--
            this.timer = setInterval(() => {
                this.second--
                if (this.second === 0) {
                    this.flag = false
                    this.second = 60
                    this.timer && clearInterval(this.timer)
                }
            }, 1000)
        },
        // 触发验证
        toVerifyMobile() {
            if (!this.reg.test(this.mobile)) {
                wx.showToast({
                    title: '请输入正确的手机号码',
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            if (!this.code) {
                wx.showToast({
                    title: '请输入手机验证码',
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            this.$ajax('API.MembersCard.BindMobile', {
                session_id: wx.getStorageSync('sessionId')
            }).then(data => {
                
            })
        }
    }
}
</script>