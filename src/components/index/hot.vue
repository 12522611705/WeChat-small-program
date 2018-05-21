<style lang='less' scoped>
    .hot-list {
        border-top: 10px solid #f2f2f2;
        border-bottom: 10px solid #f2f2f2;
        img {
            width: 70px;
            height: 70px;
            vertical-align: top;
        }
        .host__most {
            align-items: flex-start;
            padding: 10px 15px;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            .pos-absolute {
                right: 15px;
                bottom: 10px;
            }
        }
        li {
            padding: 13px 15px;
            border-top: 1px solid #eee;
        }
        .hot-title:before,{
            content: "";
            width: 126px;
            height: 11px;
            background: url(../../assets/images/hot_left@2x.png) no-repeat;
            background-size: cover;
            display: inline-block;
            margin-right: 5px;
        }
        .hot-title:after{
            content: "";
            width: 126px;
            height: 11px;
            background: url(../../assets/images/hot_right@2x.png) no-repeat;
            background-size: cover;
            display: inline-block;
            margin-left: 5px;
        }
    }
</style>

<template>
    <div class="hot-list bg-white" v-if="dataList.length">
		<div class="border-embrace">
			<p class="PT-10 PB-10 hot-title text-16 flex-row-center">
                昨日最热
			</p>
			<div 
                class="flex-row-start host__most pos-relative"
                @click.stop="toPage('detail', dataList[0].id)"
                v-if="dataList.length > 0">
				<div>
                    <img :src="dataList[0].pics[0]" lazy-load/>
                </div>
				<div class="ML-15 text-15 text-overflow__2">
                    {{dataList[0].message}}
                </div>
                <div class="text-darkGrey flex-row-end pos-absolute">
                    <span class="flex-row-start">
                        <i class="iconfont icon-dianzan11 MR-5 text-20"></i>
                        {{dataList[0].likes.length}}
                    </span>
                    <span class="flex-row-start ML-20">
                        <i class="iconfont icon-pinglun MR-5 text-20"></i>
                        {{dataList[0].comments.length}}
                    </span>
                </div>
			</div>
			<list-item
                @click="toPage('detail', item.id)"
                :value="item.message"
                v-for="(item, index) in otherDataList"
                :key="index">
            </list-item>
		</div>
	</div>
</template>

<script>
import listItem from '@/components/list-item/index.vue'
export default {
    data() {
        return {
            curPage: 1,   // 页数
            dataList: [], // 最热的数据列表 
        }
    },
    mounted() {
        this.toGetYesNewsList()
        this.$on('refresh', () => {
            this.toGetYesNewsList()
        })
    },
    computed: {
        /**
         * 返回第二条数据以后的列表
         */
        otherDataList() {
            if (this.dataList.length > 1) {
                return this.dataList.slice(1)
            }
        }
    },
    components: {
		listItem
	},
    methods: {
        /**
         * 获取昨天最热的新闻
         */
        toGetYesNewsList() {
            this.$ajax('API.MembersCard.YesNewsList', { 
                load: false,
                page: this.curPage
            }).then(data => {
                if (data.status === 200) {
                    this.dataList = data.data
                } else {
                    console.error(`${data.message}`)
                }
            })
        },
        /**
         * 跳转到其他的页面
         * @param {String} type
         * @param {Number} cid 文章的id 
         */
        toPage(type, cid) {
            wx.navigateTo({
                url: `/pages/${type}/main?cid=${cid}`
            })
        }
    }
}
</script>