<style lang='less' scoped>
    .user-info-list {
        padding-bottom: 44px;
        li {
            padding: 12px 0px;
            padding-right: 15px;
            border-bottom: 1px solid #eee;
            input {
                text-align: right;
            }
            .user-avator {
                width: 58px;
                height: 58px;
                border-radius: 100%;
            }
            &:last-child {
                border-bottom: none;
            }
        }
        .left-tag {
            width: 80px;
        }
        .what-main {
            width: 100%;
            height: 50px;
        }
        i {
            margin-top: 3px;
        }
        .wx-moblie {
            padding: 0;
            position: inherit;
            background-color: #fff;
            &:after{
                border: none;
            }
        }
    }
</style>

<template>
    <div class="bg-white">
        <ul class="user-info-list PL-15">
            <li class="flex-row-between" @click="toChangeAvatar">
                <div class="flex-row-start left-tag">
                    <i class="iconfont icon-touxiang1 icon-blue text-20 MR-10"></i>
                    <span>头像</span>
                </div>
                <div class="flex-row-start">
                    <img :src="avatarUrl" class="user-avator">
                    <span class="iconfont icon-youjiantou ML-15 text-darkGrey"></span>
                </div>
            </li>
            <li class="flex-row-between">
                <div class="flex-row-start left-tag">
                    <i class="iconfont icon-xingming- icon-blue text-20 text-20 MR-10"></i>
                    <span>姓名</span>
                </div> 
                <input type="text" v-model="username" placeholder="输入姓名" />
            </li>
            <li class="flex-row-between">
                <div class="flex-row-start left-tag">
                    <i class="iconfont icon-gongsi icon-blue text-20 MR-10"></i>
                    <span>公司</span>
                </div>
                <input type="text" v-model="company" placeholder="输入公司名称" maxlength="44"/>
            </li>
            <li class="flex-row-between">
                <div class="flex-row-start left-tag">
                    <i class="iconfont icon-zhiwei icon-blue text-20 MR-10"></i>
                    <span>职位</span>
                </div>
                <input type="text" v-model="work" placeholder="输入职位名称" maxlength="12"/>
            </li>
            <li class="flex-row-between">
                <div class="flex-row-start left-tag">
                    <i class="iconfont icon-lianxi icon-blue text-20 MR-10"></i>
                    <span>联系</span>
                </div>
                <div class="flex-row-start">
                    <span v-if="contact">{{contact}}</span>
                    <div v-else class="pos-relative">
                        <button class="text-green text-14 wx-moblie pos-absolute" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信快捷获取</button>
                    </div>
                    <span class="iconfont icon-youjiantou ML-5 text-darkGrey" v-if="!contact"></span>
                </div>
            </li>
            <li class="flex-row-between" @click="toSetAddress">
                <div class="flex-row-start left-tag">
                    <i class="iconfont icon-dizhi1 icon-blue text-20 MR-10"></i>
                    <span>地址</span>
                </div>
                <div class="flex-row-end flex-1">
                    <input type="text" v-model="showAddress" disabled placeholder="输入地址信息" class="PL-10 flex-1 text-ellipsis"/>
                    <span class="iconfont icon-youjiantou ML-5 text-darkGrey"></span>
                </div>
            </li>
            <li class="flex-row-between" @click="toPage('business')">
                <div class="flex-row-start left-tag">
                    <i class="iconfont icon-xingyeshichang icon-blue text-20 MR-10"></i>
                    <span>行业</span>
                </div>
                <div class="flex-row-start">
                    <span class="text-green">{{ business.name ? business.name : '请选择行业' }}</span>
                    <span class="iconfont icon-youjiantou ML-5 text-darkGrey"></span>
                </div>
            </li>
            <li class="flex-row-between" @click="toPage('brand')">
                <div class="flex-row-start left-tag">
                    <i class="iconfont icon-pinpai icon-blue text-20 MR-10"></i>
                    <span>品牌</span>
                </div>
                <div class="flex-row-start">
                    <span class="text-green PL-10 text-ellipsis">{{ brand ? brand : '请选择品牌' }}</span>
                    <span class="iconfont icon-youjiantou ML-5 text-darkGrey"></span>
                </div>
            </li>
            <li class="flex-row-column">
                <textarea placeholder="主营:" class="what-main" v-model="whatMain" maxlength="44"/>
            </li>
        </ul>
        <page-button :text="'保存'" @click="toAddMyCard"></page-button>
    </div>
</template>

<script>
import pageButton from '@/components/page-button/index.vue'
export default {
    title: '完善名片',
    data() {
        return {
            avatarUrl: '',  // 头像
            username: '',   // 姓名
            company: '',    // 公司
            work: '',       // 职位
            contact: '',    // 联系电话
            showAddress: '', // UI展示的详细地址
            paramAddress: '', // 接口传参数的联系地址
            business: {},   // 行业
            brand: '',      // 经营品牌
            whatMain: '',   // 主营业务
            status: '',     // 登录状态
            city: '',       // 用户选择的城市
            brand_ids: [],     // 原始获取的品牌选中ID的列表
            reg: /^1[34578]\d{9}$/,  // 电话正则匹配
        }
    },
    onLoad() {
        this.toGetProfile()
    },
    onShow() {

        // 获取行业分类关键词
        let business = wx.getStorageSync('selectPeer')
        let brand    = wx.getStorageSync('selectBrand')
        if (business) {
            this.business = business
        }
        if (brand) {
            this.toHandleBrand(brand)
        }
        this.status = this.$loginStatus
    },
    components: {
        pageButton
    },
    methods: {
        /**
         * 处理品牌渲染
         * @param { Array } brand
         */
        toHandleBrand(brand) {
            if (brand.length === 1) {
                this.brand = brand[0].name  
            } else {
                let names = []
                this.brand_ids = []
                brand.forEach((item) => {
                    this.brand_ids.push(item.id)
                    names.push(item.name)
                })
                if (names.length > 3) {
                    this.brand = names.slice(0,3).join('、').replace(/、$/, '') + '等'
                } else {
                    this.brand = names.join('、').replace(/、$/, '')
                }
            }
        },
        /**
         * 获取个人名片的资料信息
         */
        toGetProfile() {
            try {
                let userInfo = wx.getStorageSync('userInfo')
                if (!userInfo) {
                    throw new Error()
                }
                this.username  = userInfo.username
                this.avatarUrl = userInfo.avatar
                this.showAddress  = userInfo.city.province + userInfo.city.city + userInfo.city.address
                this.contact   = userInfo.mobile
                this.company   = userInfo.company
                this.work      = userInfo.title
                this.city      = userInfo.city.city
                // this.business  = userInfo.member_types && userInfo.member_types[0] || {}
                this.paramAddress = userInfo.city.address
                this.whatMain  = userInfo.tags
                //行业
                if (userInfo.member_types && userInfo.member_types[0]) {
                    this.business = {
                        id: userInfo.member_types[0].id,
                        name: userInfo.member_types[0].typeName
                    }
                }
                // 品牌
                if (userInfo.main_brand_pics) {
                    let brand = []
                    Object.keys(userInfo.main_brand_pics).forEach(item => {
                        let temp = {}
                        temp.id = userInfo.main_brand_pics[item].id
                        temp.name = userInfo.main_brand_pics[item].brand
                        brand.push(temp)
                    })
                    this.toHandleBrand(brand)
                    wx.setStorageSync('selectBrand', brand)
                    wx.setStorageSync('selectPeer', this.business)
                }
            } catch (error) {
                console.error(`获取本地用户信息错误: ${error}`)
            }
        },
        /**
         * 创建我的名片
         */
        toAddMyCard() {
            if (!this.username) {
                this.showToast('请输入姓名')
                return
            }
            if (!this.reg.test(this.contact)) {
                this.showToast('请输入正确的手机号码')
                return
            }
            if (!this.showAddress) {
                this.showToast('请输入地址')
                return
            }
            let data = {
                username: this.username,
                avatar: this.avatarUrl,
                company: this.company || '',
                title: this.work || '',
                city: this.city,
                address: this.paramAddress,
                brand_ids: this.brand_ids.join(',') || '',
                tags: this.whatMain || '',
                mobile: this.contact,
                member_type_ids: this.business.id || ''
            }
            this.$ajax('API.MembersCard.AddCard', data).then(data => {
                if (data.status === 200) {
                    if (data.data.code === '01') {
                        this.showToast('创建成功', true)
                        this.toUpdateStorageData()
                    }
                    if (data.data.code === '02') {
                        this.showToast('更新成功', true)
                        this.toUpdateStorageData()
                    }
                }
            })
        },
        /**
         * 如果更新或创建名片成功后，需要更新本地的缓存数据
         */
        toUpdateStorageData() {
            this.$ajax('API.MembersCard.PersonProfile', { load: false }).then(data => {
                if (data.status === 200) {
                    this.userInfo = data.data.member
                    // 把个人数据存储到本地的数据中
                    let storageData = {
                        avatar: this.userInfo.avatar,
                        city: this.userInfo.city,
                        company: this.userInfo.company,
                        complete_flag: this.userInfo.complete_flag,
                        influence: Math.ceil(this.userInfo.influence),
                        influence_per: this.userInfo.influence_per,
                        main_brand_ids: this.userInfo.main_brand_ids,
                        main_brand_pics: this.userInfo.main_brand_pics,
                        member_types: this.userInfo.member_types,
                        mobile: this.userInfo.mobile,
                        tags: this.userInfo.tags,
                        title: this.userInfo.title,
                        username: this.userInfo.username
                    }
                    wx.setStorageSync('userInfo', storageData)
                    this.status = data.data.status
                    this.$loginStatus = data.data.status
                }
            })
        },
        /**
         * 修改头像图片，从相册选择
         */
        toChangeAvatar() {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'],
                success: (res) => {
                    if (res.errMsg === 'chooseImage:ok') {
                        let file = res.tempFilePaths[0]
                        this.upload(file)
                    }
                },
                fail(err) {
                    console.error(err)
                }
            })
        },
        /**
         * 把本地选择的图片上传服务器
         * @param { file } file
         */
        upload(file) {
            let url = 'https://apigateway-staging.nanxinwang.com/?action=upload_file&version=4.13.0.4'
            let session = wx.getStorageSync('sessionId') || ''
            let _this = this
            return new Promise((res, rej) => {
                // 上传图片的状态
                wx.showLoading({
                    title: '上传中...'
                })
                wx.uploadFile({
                    url: url,
                    filePath: file,
                    name: 'file',
                    formData:{
                        'sessionid': session
                    },
                    success(data) {
                        if (data.statusCode === 200) {
                            data = JSON.parse(data.data)
                            if (!data.error && data.object) {
                                _this.avatarUrl = data.object.result.thumb
                            } else {
                                console.error(`${data.error}`)
                            }
                        } else {
                            console.error(`上传图片错误: ${data.errMsg}`)
                        }
                    },
                    fail(err) {
                        rej('服务器错误')
                    },
                    complete() {
                        wx.hideLoading()
                    }
                })
            })
        },
        /**
         * 设置修改地址
         */
        toSetAddress() {
            wx.chooseAddress({
                success: (res) => {
                    this.city = res.cityName
                    this.paramAddress = res.countyName + res.detailInfo
                    this.showAddress = res.provinceName + res.cityName + res.countyName + res.detailInfo
                }
            })
        },
        /**
         * 页面跳转
         * @param { String } 页面的动态标签类型
         */
        toPage(type) {
            wx.navigateTo({
                url: `/pages/${type}/main`
            })
        },
        /**
         * 快捷获取微信的手机号码
         */
        getPhoneNumber(e) {
           if (e.target.encryptedData && e.target.iv) {
                wx.login({
                    timeout: 20000,
                    success: (result) => {
                        let code = result.code
                        let data = {
                            encryptedData: e.target.encryptedData,
                            iv: e.target.iv,
                            code
                        }
                        this.$ajax('API.MembersCard.BindMobile', data).then(result => {
                            if (result.status === 200) {
                                let _data = result.data
                                if (_data.code === '01') {
                                    this.contact = _data.mobile
                                } else {
                                    wx.navigateTo({
                                        url: `/pages/verify/main`
                                    })
                                    console.error(`授权发生错误，错误提示是: ${_data.msg}`)
                                }
                            } else {
                                console.error(`接口发生错误，错误码是: ${result.code}, 错误提示是: ${result.message}`)
                            }
                        })
                    },
                    fail(error) {
                        console.error(error)
                    }
                })
           }
        },
        /**
         * 提示信息
         * @param { String } msg
         */
        showToast(msg, icon = false) {
            wx.showToast({
                title: msg,
                icon: icon ? 'success' : 'none',
                duration: 1500
            })
        }
    },
    onUnload() {
        this.brand = ''
        wx.removeStorageSync('selectPeer')
        wx.removeStorageSync('selectBrand')
    }
}
</script>