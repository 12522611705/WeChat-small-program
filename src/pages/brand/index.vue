<style lang="less" scoped>
.brand-list{
    position: relative;
}
.hide{
    display: none;
}
.brand-list__module {
    .brand-list__content{
        background: #fff;
        padding-bottom: 40px;
        padding-left: 10rpx;
        flex-wrap: wrap;
        .brand-list__item {
            margin-top: 40rpx;
            width: 25%;
            align-items: flex-start;
            margin-top: 40px;
            width: 68px;
        }
    }
    
    .brand-img {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        position: relative;
        .img__src{
            width: 50px;
            height: 50px;
        }
        .brand-item__icon{
            position: absolute;
            top:-10px;
            right:-10px;
        }
    }
    .brand-name {
        width: 68px;
        text-align: center;
    }
}
.btn-footer {
    background: #fff;
    .btn-check{
        border-top: 1px solid #eee;
    }
    .btn-footer__item{
        flex: 1;
        width: 100%;
        text-align: center;
        height:46px;
        line-height:44px;
        .btn-check__item{
            flex: 1;
            width: 100%;   
            .btn-check__box{
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 1px solid #BCBCBC;
                line-height:32rpx;
                font-size:10px;
                color: #fff;
                &.check{
                    background: #F5A623;
                    border-color: #F5A623;
                }
            }
        }
    }
}
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
    <div class="container brand-select">
        <div class="search-box height">
            <div class="search-bar flex-row-start">
                <icon 
                type="search" 
                size="14" 
                class="ML-10"/>
                <input 
                    class="PL-10 search-bar__input"
                    v-model="search"
                    placeholder="搜索品牌"
                    @input="searchChange"/>
                <icon 
                    type="clear" 
                    size="18" 
                    class="ML-10"
                    v-if="search"
                    @click="search=''"/>
            </div>
        </div>
        
        <scroll-view 
            class="brand-list"
            scroll-y
            @scroll="scrollFn"
            :style="{height: height}"
            :scroll-into-view="letterList[letterIndex]">
            <div 
                v-for="(item, key) in brands" 
                class="brand-list__module"
                :class="{'hide': (search && !item.show)}"
                :id="key"
                :key="index">
                <friend-title :title="key"></friend-title>
                <ul class="flex-row-start brand-list__content">
                    <li 
                    class="pos-relative flex-column-center brand-list__item"
                    :class="{'hide': (search && !brand.show)}" 
                    @click.stop="toSetTag(brand, key, index)"
                    v-for="(brand, index) in item.list" 
                    :key="index">
                        <div class="brand-img flex-row-center">
                            <img 
                            class="img__src" 
                            :src="brand.icon" 
                            mode="widthFix">

                            <icon 
                                type="success" 
                                size="16"
                                v-if="brand.select"
                                color="#F5A623"
                                class="brand-item__icon"/>
                        </div>
                        <span class="MT-10 brand-name text-ellipsis text-14">
                            {{brand.name}}
                        </span>
                    </li>
                </ul>
            </div>
        </scroll-view>
        <!-- 底部按钮 -->
        <div class="btn-footer flex-row-start height">
            <div class="btn-footer__item btn-check text-14 flex-row-start" v-if="mode == 1">
                <div class="btn-check__item btn-check__all text-darkGrey flex-row-center" @click="allCheck">
                    <div class="btn-check__box MR-5 iconfont" :class="{'check': checked}">&#xe62c;</div>全选
                </div>
                <div class="btn-check__item btn-check__num">
                    已选<span class="text-red">{{cacheBrands.length}}</span>个
                </div>
            </div>
            <div class="btn-footer__item btn-blue text-14" @click.stop="toFinishBrand">完成</div>
        </div>
        <letter-list 
            :list="letterList"
            @change="val => letterIndex = val"
            v-if="!search">
        </letter-list>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { orderBy } from '@/assets/utils/index.js'
import search from '@/components/search/index.vue'
import letterList from '@/components/letter-list/index.vue'
import friendTitle from '@/components/friend-title/index.vue'

// 品牌总数量
let BRAND_NUM = 0
// 当前标题位置数组
let TITLE_ARR = []
export default {
    title: '选择品牌',
    data() {
        return {
            search: '',
            // 当前是否全选
            checked: false,
            // 当前选中的品牌
            cacheBrands: [],
            // 字母数组
            letterList: [],
            // 当前选中的字母索引
            letterIndex: null,
            // 品牌数组
            brands: null,
            // scroll高度
            height: wx.getStorageSync('systemInfo').windowHeight + 'px',
            // 当前选择模式， 1：多选  2：单选
            mode: 1
        }
    },
    onLoad() {
        // 如果当前需要单选
        if (this.$root.$mp.query.radio) {
            this.mode = 2
        }
        let brand = wx.getStorageSync('selectBrand') || []
        this.cacheBrands = brand
        this.getBrands()
        this.setScrollHeight()
    },
    onUnload() {
        this.letterIndex = null,
        this.mode = 1,
        this.checked = false
        this.search = ''
    },
    methods: {
        ...mapActions([
            'setLetterScrollTop'
        ]),

        /**
         * 设置滚动框高度
         */
        setScrollHeight() {
            let query  = wx.createSelectorQuery()
            let nodes = query.selectAll('.height')
            let height = 0
            nodes.fields({
                size: true
            }, data => {
                data.forEach((item) => {
                    height += item.height
                })  
                this.height = wx.getStorageSync('systemInfo').windowHeight - height + 'px'
            }).exec()
        },

        /**
         * 搜索框文字变化
         * @param {String} val 当前文字
         */
        searchChange(e) {
            const val = e.target.value
            Object.values(this.brands).map(item => {
                let num = 0
                item.list.map(child => {
                    if (val && child.name.indexOf(val) != -1) {
                        child.show = true
                        num++
                    } else {
                        child.show = false
                    }
                    return child
                })
                item.show = !!num
                return item
            })
        },
        
        scrollFn(e) {
            this.setLetterScrollTop(e.mp.detail.scrollTop)
        },
        /**
         * 获取品牌数据
         */
        getBrands() {
            this.$ajax('API.Data.Vehicle.BSM&version=4.19.0.1', {
                apiUrl: 'http://staging-apigateway-3.nanxinwang.com/'
            }).then(data => {
                this.forMatBrands(data.data.brand)
            })
        },
        /**
         * 格式化品牌数据
         * @param {Array} brands 品牌数组
         */
        forMatBrands(brands) {
            let obj = {}
            BRAND_NUM = brands.length
            brands.forEach((item, index) => {
                item = this.deleteBransKey(item)
                // 如果当前有选中的品牌
                this.cacheBrands.forEach(child => {
                    if (item.id == child.id) {
                        item.select = true
                    }
                })                
                obj[item.py] = obj[item.py] || {}
                obj[item.py].list = obj[item.py].list || []
                obj[item.py].show = false
                obj[item.py].list.push(item)
            })
            this.brands = orderBy(obj)
            // 获取到当前的字母
            this.letterList = Object.keys(this.brands)
            
            // let brandStorage = wx.getStorageSync('selectBrand')
            // if (brandStorage && brandStorage.length > 0) {
            //     this.letterIndex = this.letterList.indexOf(brandStorage[0].py)
            // }
        },

        /**
         * 初始化品牌数据
         * @param {Object} item 品牌数据
         */
        deleteBransKey(item) {
            item.show = false
            item.select = false
            item.name = item.brandName
            delete item.brandName
            delete item.brandShortName
            delete item.hot
            delete item.lastupdate
            delete item.partsPic
            delete item.titleIcon
            delete item.smallIcon
            return item
        },

        /**
         * 设置当前的品牌为选中状态
         * @param { Number } index 索引
         * @param {String} key 当前品牌所在字母组
         * @param {Number} index 当前品牌所在组的索引
         */
        toSetTag(brand, key, index) {
            brand.select = !brand.select
            // 当前是多选模式
            if (this.mode == 1) {
                brand.select ? this.cacheBrands.push(brand) : this.removeCacheBrand(brand.id)
                this.checked = BRAND_NUM === this.cacheBrands.length ? true : false
            // 当前是单选
            } else if (this.mode == 2) {
                // 如果当前是选中的，就让其他的都失去选中
                if (brand.select) {
                    Object.values(this.brands).map(item => {
                        return item.list.map((child, i) => {
                            if (child.py != key || i != index) {
                                child.select = false
                            }
                            return child
                        })
                    })
                    this.cacheBrands = [brand]
                } else {
                    this.removeCacheBrand(brand.id)
                }
            }
            
        },

        /**
         * 删除某个选中的品牌
         * @param {String} id 品牌id
         */
        removeCacheBrand(id) {
            for (let i = 0, len = this.cacheBrands.length; i < len; i++) {
                let item = this.cacheBrands[i]
                if (item.id === id) {
                    this.cacheBrands.splice(i, 1)
                    break
                }
            } 
        },
        /**
         * 全选-选中所有的品牌
         */
        allCheck() {
            this.checked = !this.checked
            this.cacheBrands = []
            for (let i in this.brands) {
                let brands = this.brands[i].list
                brands.map((item) => {
                    item.select = this.checked
                    this.checked && this.cacheBrands.push(item)
                    return item
                })
            }
        },
        /**
         * 选中品牌后，完成回退
         */
        toFinishBrand() {
            if (!this.cacheBrands.length && this.mode == 1) {
                wx.showToast({
                    title: '请选择品牌',
                    icon: 'none'
                })
                return
            }
            wx.setStorageSync('selectBrand', this.cacheBrands)
            wx.navigateBack()
        }
    },
    components: {
        search,
        letterList,
        friendTitle
    }
}
</script>