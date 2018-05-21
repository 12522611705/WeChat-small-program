<style lang="less">
page{
  font-size: 32rpx;
  color: #333;
  background: #f2f2f2;
  font-family: PingFangSC-Regular;
  width: 100%;
  height: 100%;
}
.placeholder{
  color: #A1A1A1;
  line-height: 200rpx;
}
.search-box {
  padding: 16rpx 36rpx;
  background-color: #F8F8F8;
  .search-bar {
      border-radius: 100px;
      border: 1px solid #9ED1FA;
      box-shadow: 0 0 5px #9ED1FA;
      height: 70rpx;
      background: #fff;
      padding: 0 20rpx 0 30rpx;
  }
  .search-bar__input {
      width: 100%;
      flex: 1;
      height: 40rpx;
      line-height: 40rpx;
      font-size: 28rpx;
  }
}
</style>

<script>
export default {
  onLaunch() {
    console.log('初始化小程序', this)
  }
}
</script>


