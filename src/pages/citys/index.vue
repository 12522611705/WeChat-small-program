<style lang='less' scoped>
    .citys-list{
        background: #fff;
        .citys-list__title{
            height: 50px;
            padding: 0 36rpx;
            .citys-title__all{
                border: 1px solid #A1A1A1;
                width: 75px;
                height: 25px;
                line-height: 25px;
                text-align: center;
                border-radius: 25px;
            }
        }
        .citys-list__item{
            padding: 10px;
            border-bottom: 1px solid #EEE;
        }
        .citys-list__scroll{
            position: relative;
        }
    }
</style>

<template>
    <div class="citys">
        <div class="search-box">
            <div class="search-bar flex-row-start" @click="focusFn">
                <icon 
                type="search" 
                size="14" 
                class="ML-10"/>
                <input 
                    class="PL-10 search-bar__input"
                    placeholder="搜索城市"
                    v-model="search"
                    @input="searchChange"/>
                <icon 
                    type="clear" 
                    size="18" 
                    class="ML-10"
                    v-if="search"
                    @click="removeSearch"/>
            </div>
        </div>
        <div class="citys-list" v-if="citys">
            <div class="citys-list__title flex-row-start">
                <div class="citys-title__all text-14 MR-10 text-666" @click="allCitys">全部城市</div>
                <div class="citys-title__check text-14" v-if="curCity">
                    已选城市:<span class="text-blue">{{curCity.name}}</span>
                </div>
            </div>
            <scroll-view 
            scroll-y 
            :style="{height: height}"
            class="citys-list__scroll"
            :scroll-into-view="letterList[letterIndex]"
            @scroll="scrollFn">
                <div 
                v-for="(item, index) in citys"
                :id="index"
                :key="index"
                v-if="item.show">
                    <friend-title :title="index"></friend-title>
                    <div 
                    class="citys-list__item text-15" 
                    v-for="(child,key) in item.list" 
                    :key="key"
                    v-if="child.show"
                    @click="cityClick(child)">
                        {{child.name}}
                    </div>    
                </div>
            </scroll-view>
        </div>
        <letter-list 
            :list="letterList"
            @change="val => letterIndex = val"
            @touchstart="letterTouch = true"
            @touchend="letterTouch = false">
        </letter-list>
    </div>
</template>

<script>
import friendTitle from '@/components/friend-title/index.vue'
import citys from '@/assets/utils/city.json'
import letterList from '@/components/letter-list/index.vue'
import { mapActions } from 'vuex'
export default {
    props: {

    },
    data() {
        return {
            // scroll高度
            height: wx.getStorageSync('systemInfo').windowHeight - 56 - 55 + 'px',
            // 城市数据
            citys,
            // 当前搜索
            search: '',
            // 当前字母列表
            letterList: Object.keys(citys),
            // 当前选中的字母索引
            letterIndex: null,
            // 当前选中的城市
            curCity: null,
        }
    },
    onLoad() {
        console.log(this.citys)
        this.curCity = wx.getStorageSync('selectCitys')
    },
    beforeDestroy() {
        this.letterIndex = null
    },
    components: {
        friendTitle,
        letterList
    },
    methods: {
        ...mapActions([
            'setLetterScrollTop'
        ]),
        removeSearch() {
            this.search = ''
            this.searchChange()
        },
        /**
         * 滚动
         */
        scrollFn(e) {
            this.setLetterScrollTop(e.mp.detail.scrollTop)
        },
        /**
         * 搜索框文字变化
         */
        searchChange() {
            Object.values(this.citys).map(item => {
                item.show = !!!this.search
                let num = 0
                item.list.map(child => {
                    child.show = !!!this.search
                    if (this.search && child.name.indexOf(this.search) != -1) {
                        child.show = true
                        num++
                    }
                    return child
                })
                this.search && (item.show = !!num)
                return item
            })
        },
        /**
         * 选中城市
         * @param {Object} item 当前选中的城市
         */
        cityClick(item) {
            wx.setStorageSync('selectCitys', item)
            wx.navigateBack()
        },
        /**
         * 选中全部城市
         */
        allCitys() {
            wx.removeStorageSync('selectCitys')
            wx.navigateBack()
        }
    }
}
</script>