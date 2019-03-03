<template>
  <!-- <div class="title-container" :style="'height: ' + navigationBarHeight">
    <view :style="'height: ' + statusBarHeight"></view>
    <view class='left'>
      <view @click='back' class='magrin-right'>
        <image :src='backImg'></image>            
      </view>
      <view @click='backHome' class="margin-left">
        <image :src='homeImg'></image>
      </view>
    </view>
    <view class='title'>{{title}}</view>
  </div> -->
  <view class="navbar" :style="'height: ' + navigationBarHeight">
    <view :style="'height: ' + statusBarHeight"></view>
    <view class='title-container'>
      <view class='capsule'>
        <view @click='back'>
          <image :src='backImg'></image>            
        </view>
        <view @click='backHome'>
          <image :src='homeImg'></image>
        </view>
      </view>
      <view class='title'>{{title}}</view>
    </view>
  </view>
</template>
<script>
export default {
  props:['title'],
  data(){
    return{
      backImg: require('../images/back.svg'),
      homeImg: require('../images/home.svg'),
      navigationBarHeight: '',
      statusBarHeight: ''
    }
  },
  methods:{
    backHome() {
      wx.reLaunch({
        url: '/pages/me/main',
      })
    },
    back() {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  mounted(){
    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        this.navigationBarHeight = res.statusBarHeight + 44 + 'px'
        this.statusBarHeight = res.statusBarHeight + 'px'
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  width: 100vw;
  background-color: #2f2f2f;
  position: fixed;
  z-index: 4;
}

.title-container {
  height: 44px;
  display: flex;
  align-items: center;
  position: relative;
}

.capsule {
  margin-left: 10px;
  height: 32px;
  border: 1px solid #777;
  border-radius: 16px;
  display: flex;
  align-items: center;
}

.capsule > view {
  width: 32px;
  height: 60%;
  position: relative;
}

.capsule > view:nth-child(2) {
  border-left: 1px solid #777;  
}

.capsule image {
  width: 60%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}

.title {
  color: white;
  position: absolute;
  left: 104px;
  right: 104px;
  font-size: 14px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}



// .left{
//   height: 32;
//   border: 1px solid #777;
//   width: 120rpx;
//   border-radius: 16px;
//   display: flex;
//   align-items: center;
//   padding: 0 15rpx;
  
// }
// .left image{
//   float: left;
//   width: 50rpx;
//   height: 50rpx;
// }
// .magrin-right{
//   padding-right: 10rpx;
//   border-right: 1px solid #777;
// }
// .margin-left{
//   padding-left: 10rpx;
// }
// .title-container {
//   display: flex;
//   align-items: center;
//   position: relative;
//   background-color: #EA5A49;
//   position: fixed; 
//   width: 100vw;
//   // height: 44px;
// }

// .title{
//   color: black;
//   position: absolute;
//   display: inline-block;
//   left: 104px;
//   right: 104px;
//   font-size: 30rpx;
//   text-align:center;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
</style>


