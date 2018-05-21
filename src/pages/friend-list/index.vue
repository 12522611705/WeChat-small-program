<style lang='less' scoped>
.friend-list{
    height: 100%;
    position: relative;
    background: #fff;
}
</style>

<template>
    <div class="friend-list">
        <block v-if="friendList">
            <div class="search-box height">
                <div class="search-bar flex-row-start">
                    <icon 
                    type="search" 
                    size="14" 
                    class="ML-10"/>
                    <input 
                        class="PL-10 search-bar__input"
                        placeholder="搜索人名、公司、主营"
                        v-model="search"
                        :disabled="!friendList || friendList.length <= 0"/>
                    <icon 
                        type="clear" 
                        size="18" 
                        class="ML-10"
                        v-if="search"
                        @click="search=''"/>  
                </div>
            </div>
            <nav-bar :list="navList" @change="navBarChange"></nav-bar> 
        </block>
        
        
        <scroll-view 
            scroll-y
            class="friend-module"
            :style="{'height': height}"
            :scroll-into-view="letterList[letterIndex]"
            @scroll="scrollFn">
            <div v-for="(item, key) in friendList" :key="key" :id="key" v-if="item.show">
                <friend-title :title="key"></friend-title>
                <div class="friend-module__content">
                    <friend-item
                        v-for="(child, index) in item.list"
                        :key="index"
                        :avatar="child.avatar"
                        :title="child.username"
                        :line-one="`${child.company} ${child.title}`"
                        :line-two="child.mainBrands"
                        v-if="child.show"
                        @click="goInfo(child)"
                        @avatar="goInfo(child)"
                        @btn="goInfo(child)">
                    </friend-item>
                </div>
            </div>
            <no-data v-if="!friendList"></no-data>
            <end-line status="2" v-if="friendList"></end-line>
        </scroll-view>
        <letter-list 
            :list="letterList" 
            @change="val => letterIndex = val"
            v-if="!search && !navList[0].id && !navList[1].id && !navList[2].id">
        </letter-list>
    </div>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import friendItem from '@/components/friend-item/index.vue'
import friendTitle from '@/components/friend-title/index.vue'
import letterList from '@/components/letter-list/index.vue'
import noData from '@/components/no-data/index.vue'
import endLine from '@/components/end-line/index.vue'
import { mapActions } from 'vuex'
import {throttle} from '@/assets/utils/index.js' 
// 需要搜索的数据字段
let SEARCH_KEY = ['username', 'company', 'mainBrands']
export default {
    title: '好友列表',
    data() {
        return {
            // 好友列表
            friendList: null,
            // 右边字母列表
            letterList: [],
            // 当前scroll高度
            height: wx.getStorageSync('systemInfo').windowHeight + 'px',
            // 当前选中的字母索引
            letterIndex: 0,
            // 搜索关键字
            search: '',
            // tab栏数据
            navList: [{
                name: '全部城市'
            }, {
                name: '全部同行'
            }, {
                name: '全部品牌'
            }]
        }
    },
    onShow() {
        let selectCitys = wx.getStorageSync('selectCitys')
        let selectPeer = wx.getStorageSync('selectPeer')
        let selectBrand = wx.getStorageSync('selectBrand')
        selectBrand = selectBrand && selectBrand.length > 0 ? selectBrand[0] : null
        this.changeHandler(selectCitys, 0, '全部城市')
        this.changeHandler(selectPeer, 1, '全部同行')
        this.changeHandler(selectBrand, 2, '全部品牌')
    },
    mounted() {
        this.getFriendList()
    },
    watch: {
        search() {
            this.searchList(this)
        },
        navList: {
            deep: true,
            handler(val) {
                console.error(val)
            }
        }
    },
    onUnload() {
        wx.removeStorageSync('selectCitys')
        wx.removeStorageSync('selectPeer')
        wx.removeStorageSync('selectBrand')
        this.letterIndex = 0
        this.search = ''
        this.navList = [{
            name: '全部城市'
        }, {
            name: '全部同行'
        }, {
            name: '全部品牌'
        }]
    },
    components: {
        navBar,
        friendItem,
        friendTitle,
        letterList,
        noData,
        endLine
    },
    methods: {
        ...mapActions([
            'setLetterScrollTop'
        ]),
        /**
         * 去到名片详情页
         * @param {Object} item 当前用户信息
         */
        goInfo(item) {
            wx.navigateTo({
                url: `/pages/card/main?uid=${item.uid}`
            })
        },
        /**
         * 监听当前的数据和以前的是否有区别
         * @param {Object} item 当前最新数据
         * @param {Number} navIndex 当前是nav的第几个数据
         * @param {String} noData 没有数据需要显示的内容
         */
        changeHandler(item, navIndex, noData) {
            // 修改了城市
            if (item && this.navList[navIndex].id != item.id) {
                this.itemHandler(item, navIndex)
            // 如果上一次有，这次回来没有了
            } else if (this.navList[navIndex].id && !item) {
                this.itemHandler({name: noData}, navIndex)
            }
        },
        /**
         * 选中某个类型
         * @param {Object} item 当前选中对象
         * @param {Number} index 当前选中索引
         */
        itemHandler(item, index) {
            this.navList[index] = item
            this.searchList(this)
        },
        /**
         * 切换tab index
         * @param {Number} index 当前切换的index
         */
        navBarChange(index) {
            switch (index) {
                case 0:
                    wx.navigateTo({
                        url: '/pages/citys/main'
                    })
                    break
                case 1:
                    wx.navigateTo({
                        url: '/pages/business/main'
                    })
                    break
                case 2:
                    wx.navigateTo({
                        url: '/pages/brand/main?radio=1'
                    })
                    break
            }
        },
        scrollFn(e) {
            this.setLetterScrollTop(e.mp.detail.scrollTop)
        },
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
         * 搜索好友列表
         */
        searchList:throttle(($this) => {
            Object.values($this.friendList).map(item => {
                item.show = !$this.getSearchStatus()
                let num = 0
                item.list.map(child => {
                    child.show = !$this.getSearchStatus()
                    for (let i = 0, len = SEARCH_KEY.length; i < len; i++) {
                        let key = SEARCH_KEY[i]
                        // 如果当前搜索内容和搜索字段不相关相关
                        if ($this.search && (!child[key] || child[key].indexOf($this.search) == -1)){
                            console.log('搜索内容不匹配', child)
                            continue
                        }
                        // 当前需要筛选城市id，不匹配
                        if ($this.navList[0].id && $this.navList[0].id !=  child.city_id) {
                            console.log('城市id不匹配', child)
                            continue
                        }
                        // 当前需要筛选同行id，不匹配
                        if ($this.navList[1].id) {
                            if (!child.member_type_ids) {
                                console.log('没有行业id', child)
                                continue
                            }
                            let ids = child.member_type_ids.split(',')
                            if (!ids.includes($this.navList[1].id)) {
                                console.log('行业id不匹配', child)
                                continue
                            }
                        }
                        // 当前需要筛选品牌
                        if ($this.navList[2].id) {
                            // 如果没有主营品牌直接跳过
                            if (!child.main_brand_ids) {
                                console.log('没有主营品牌', child)
                                continue
                            }
                            let ids = child.main_brand_ids.split(',')
                            if (!ids.includes($this.navList[2].id)) {
                                console.log('主营品牌不匹配', child)
                                continue
                            }
                        }
                        console.log('通过', child)
                        num++
                        child.show = true
                    }
                    return child
                })
                if (num > 0) {
                    item.show = true
                }
                return item
            })
        }, 300),
        /**
         * 监听搜索框获取焦点
         */
        focusFn() {
            wx.navigateTo({
                url: '../search-contacts/main'
            })
        },
        getFriendList() {
            this.$ajax('API.MembersCard.getFriends').then(data => {
                let res = data.data
                for (let item in res) {
                    let list = res[item]
                    list.map(item => {
                        item.show = true
                        return item
                    })
                    res[item] = {
                        show: true,
                        list
                    }
                }
                this.friendList = res
                this.letterList = Object.keys(this.friendList)
                setTimeout(() => {
                    this.setScrollHeight()
                }, 200)
            })
        },
        /**
         * 获取当前是否有搜索状态
         * @returns 返回当前是否有搜索状态
         */
        getSearchStatus() {
            if (this.search) {
                return true
            }
            for (let i = 0, len = this.navList.length; i < len; i++) {
                if (this.navList[i].id) {
                    return true
                    break
                }
            }
            return false            
        }
    }
}
</script>