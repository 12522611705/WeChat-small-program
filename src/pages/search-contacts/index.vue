<style lang='less' scoped>
.search-contacts{
    height: 100%;
}
.search-contacts__info{
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .search-info__list,.search-contacts__tags{
        height: 100%;
    }
}
.search-info__list{
    position: relative;
}
.search-list__item{
    padding: 20rpx;
    border-bottom: 1px solid #eee;
    background: #fff;
    .friend-avater{
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        overflow: hidden;
        background: #f2f2f2;
        align-self:flex-start;
        .avater-img{
            width: 100%;
        }
    }
    .friend-info{
        flex: 1;
        width: 100%;
        overflow: hidden;
        line-height: 42rpx;
    }
    .friend-btn{
        align-self:flex-start;
        font-size: 24rpx;
        background: #fff;
        padding: 0 20rpx;
        height: 26px;
        line-height: 28px;            
    }
}
</style>

<template>
    <div class="search-contacts flex-column-start">
        <div class="search-box">
            <div class="search-bar flex-row-start">
                <icon 
                type="search" 
                size="14" 
                class="ML-10"/>
                <input 
                    type="text"
                    class="PL-10 search-bar__input"
                    v-model="search"
                    placeholder="搜索发现更多人脉"
                    focus
                    confirm-type="search"
                    @confirm="searchChange"/>
                <icon 
                    type="clear" 
                    size="18" 
                    class="ML-10"
                    v-if="search"
                    @click="removeSearch"/>
            </div>
        </div>
        <div class="search-contacts__info">
            <div class="search-contacts__tags">
                <item-module
                    :name="item.title"
                    :list="item.list"
                    :key="index"
                    key-name="name"
                    :index="index"
                    @handler="itemHandler"
                    v-for="(item, index) in tags">
                </item-module>
            </div>
        </div>
    </div>
</template>

<script>
import itemModule from '@/components/item-module/index.vue'
import navBar from '@/components/nav-bar/index.vue'
import {throttle} from '@/assets/utils/index.js' 
export default {
    data() {
        return {
            // 热门标签
            tags: null,
            // 当前搜索框文字
            search: '',
        }
    },
    mounted() {
        this.getTags()
    },
    onUnload() {
        this.restoreNav()
    },
    components: {
        itemModule,
        navBar
    },
    methods: {
        removeSearch() {
            this.search = ''
        },
        /**
         * 重置navtab 数据
         */
        restoreNav() {
            wx.removeStorageSync('selectCitys')
            wx.removeStorageSync('selectPeer')
            wx.removeStorageSync('selectBrand')
            this.search = ''
        },
        /**
         * 选中某个类型
         * @param {Object} item 当前选中对象
         * @param {Number} index 当前选中索引
         */
        itemHandler(item, index) {
            switch (index) {
                case 0:
                    wx.setStorageSync('selectPeer', item)
                    wx.navigateTo({
                        url: `/pages/search-list/main?search=${this.search}`
                    })
                    break;
                case 1:
                    wx.setStorageSync('selectBrand', [item])
                    wx.navigateTo({
                        url: `/pages/search-list/main?search=${this.search}`
                    })
                    break;
                case 2:
                    wx.setStorageSync('selectCitys', item)
                    wx.navigateTo({
                        url: `/pages/search-list/main?search=${this.search}`
                    })
                    break;
            }
        },
        /**
         * 搜索框文字变化
         */
        searchChange(e) {
            this.search = e.target.value
            if (!this.search) {
                return
            }
            wx.navigateTo({
                url: `/pages/search-list/main?search=${this.search}`
            })
        },
        /**
         * 获取热门标签
         */
        getTags() {
            this.$ajax('API.MembersCard.GetHotConnnect').then(data => {
                this.tags = data.data
            })
        }
    }
}
</script>