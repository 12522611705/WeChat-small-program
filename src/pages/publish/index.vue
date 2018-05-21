<style lang='less' scoped>
    .publish {
        height: 100%;
        overflow: hidden;
        position: relative;
        width: 100%;
        .content {
            margin: 20px 15px;
        }
        .textarea {
            margin-bottom: 60px;
            height: 36px;
            width: 100%;
        }
        .flex-wrap {
            flex-wrap:wrap;
        }
        .upload-img {
            width: 148rpx;
            height: 148rpx;
            vertical-align: top;
        }
        .upload_li {
            margin-right: 16px;
            margin-bottom: 10px;
            &:nth-of-type(4n){
                margin-right: 0px;
            }
        }
        .icon__delete {
            position: absolute;
            right: -8px;
            top: -8px;
        }
        .upload-pic {
            width: 148rpx;
            height: 148rpx;
            line-height: 148rpx;
            text-align: center;
            background-color: #f2f2f2;
            .text-add {
                font-size: 38px;
                color: #ddd;
            }
        }
    }
</style>

<template>
    <div class="bg-white publish">
        <div class="content">
            <textarea
                placeholder="想说点什么呢..."
                class="text-14 textarea"
                maxlength="44"
                v-model="content"
            />
            <div class="flex-row-start flex-wrap flex-left">
                <div
                    v-for="(image, index) in pics"
                    :key="index"
                    class="upload_li pos-relative">
                    <img :src="image" class="upload-img"/>
                    <i class="iconfont icon-shanchu icon__delete text-yellow" @click="toDeletePic(index)"></i>
                </div>
                <div class="upload-pic" @click.stop="selectFile">
                    <span class="text-add">+</span>
                </div>
            </div>
        </div>
        <page-button :text="'立即发布'" :styles="flag ? 'btn-blue' : 'btn-backGray'" @click="toPublish"></page-button>
        <action-sheet :hidden="actionSheetHidden" @change="listenerActionSheet" v-if="!actionSheetHidden">
            <block v-for="(item, index) in actionSheetItems" :key="index"> 
                <action-sheet-item @click="toActionSheet(index)">{{item}}</action-sheet-item>
            </block>
            <action-sheet-cancel>取消</action-sheet-cancel>
        </action-sheet>
    </div>
</template>

<script>
import pageButton from '@/components/page-button/index.vue'
import { mapActions } from 'vuex'
export default {
    title: '发布动态',
    data() {
        return {
            content: '', // 发布的文字内容
            flag: false, // 是否添加了图片内容
            pics: [],    // 发布的图片列表
            paramPics: [], // 传给服务器的图片地址
            actionSheetItems: ['从相册选择', '拍摄'], // 相片的选择渠道
            actionSheetHidden: true, // 弹出相片的选择判断
        }
    },
    watch: {
        /**
         * 监听图片内容的更新
         */
        pics(val) {
            if (val.length) {
                this.flag = true
            } else {
                this.flag = false
            }
        }
    },
    components: {
        pageButton
    },
    methods: {
        ...mapActions([
            'setPublishStatus'
        ]),
        /**
         * 监听图片的选择项目
         */
        listenerActionSheet() {
            this.actionSheetHidden = !this.actionSheetHidden
        },
        /**
         * 是否选择相机获取图片库来上传图片
         * @param { Number } index 0: 相册 1：相机
         */
        toActionSheet(index) {
            let type = index === 0 ? 'album' : 'camera'
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: [type],
                success: (res) => {
                    if (res.errMsg === 'chooseImage:ok') {
                        let file = res.tempFilePaths[0]
                        this.upload(file)
                    }
                },
                fail(err) {
                    console.error(err)
                },
                complete: () => {
                    this.actionSheetHidden = !this.actionSheetHidden
                }
            })
        },
        /**
         * 选择本地图片
         */
        selectFile() {
            this.actionSheetHidden = false
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
                                _this.pics.push(data.object.result.thumb)
                                _this.paramPics.push(data.object.result.url)
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
         * toPublish 发布朋友圈
         */
        toPublish() {
            if (!this.flag) return
            let data = {
                message: this.content,
                pics: this.paramPics.join(',')
            }
            this.$ajax('API.MembersCard.AddPost', data).then(data => {
                if (data.status === 200) {
                    if (data.data.code === '01') {
                        wx.showToast({
                            title: '发布成功',
                            duration: 1500,
                            success: () => {
                                this.setPublishStatus(true)
                                setTimeout(() => {
                                    wx.navigateBack()
                                }, 500)
                            }
                        })
                    } else {
                        wx.showToast({
                            title: data.data.msg || '发布失败',
                            duration: 1500
                        })
                    }
                } else {
                    console.error(`接口返回的错误信息: ${data.message}`)
                }
            })
        },
        /**
         * 删除已上传的图片
         * @param { Number } 图片的索引值
         */
        toDeletePic(index) {
            this.pics.splice(index, 1)
            this.paramPics.splice(index, 1)
        }
    },
    onUnload() {
        this.content = ''
        this.flag = false
        this.pics = []
        this.actionSheetHidden = true
    }
}
</script>