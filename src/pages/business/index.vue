<style lang='less' scoped>
    .business-select {
        .select-item__list {
            padding: 30px 15px 20px 15px;
            .select-item__li {
                margin-right: 20px;
                margin-bottom: 10px;
                width: 68px;
                height: 25px;
                background-color: #eeeeee;
                border-radius: 100px;
            }
            .right-type {
                margin-right: 0px;
            }
            .active {
                color: #fff !important;
                background-color: #65a4f4;
            }
        }
    }
</style>

<template>
    <div class="business-select bg-white">
        <div class="select-item" v-for="(item, index) in typeList" :key="index">
            <friend-title :title="item.member_tag"></friend-title>
            <ul class="select-item__list flex-row-start flex-wrap">
                <li
                    class="text-12 text-666 select-item__li flex-column-center" 
                    @click.stop="toSetTag(type.id, type.type_name)" 
                    :class="{ 'active': typeId == type.id, 'right-type': (i+1)%4 === 0 }" 
                    v-for="(type, i) in item.types" :key="i"
                >
                    {{type.type_name}}
                </li>
            </ul>
        </div>
        <!-- 底部按钮 -->
        <page-button :text="'保存'" @click="toSaveBusiness"></page-button>
    </div>
</template>

<script>
import pageButton from '@/components/page-button/index.vue'
import friendTitle from '@/components/friend-title/index.vue'
export default {
    title: '选择身份',
    data() {
        return {
            typeList: [], // 身份列表
            typeId: '', // 选中的身份ID
            typeName: '', // 选中的身份名称
        }
    },
    onLoad() {
        this.toGetMemberType()
        let type = wx.getStorageSync('selectPeer')
        if (type) {
            this.typeId   = type.id
            this.typeName = type.name
        }
    },
    components: {
        pageButton,
        friendTitle
    },
    methods: {
        /**
         * 获取身份列表
         */
        toGetMemberType() {
            this.$ajax('API.MembersCard.GetMemberType').then(data => {
                if (data.status === 200) {
                    this.typeList = data.data.list
                }
            })
        },
        /**
         * 设置身份的ID
         * @param id 标识ID
         * @param name 标识名称
         */
        toSetTag(id, name) {
            if (id === this.typeId) {
                this.typeId   = ''
                this.typeName = ''
                return 
            }
            this.typeId = id
            this.typeName = name
        },
        toSaveBusiness() {
            if (this.typeId) {
                wx.setStorageSync('selectPeer', {
                    id: this.typeId,
                    name: this.typeName
                })
            } else {
                wx.removeStorageSync('selectPeer')
            }
            wx.navigateBack()
        }
    },
    onUnload() {
        this.typeId   = ''
        this.typeName = ''
    }
}
</script>