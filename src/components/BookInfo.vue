<template>
  <div class="bookinfo">
    <div class="thumb">
      <img 
        class="back" 
        :src="info.image"
        mode="aspectFill"
        >
      <img 
        :src="info.image" 
        class="img"
        mode="aspectFit"
        >
      <div class="info">
        <div class="title">
          {{ info.title }}
        </div>
        <div class="author">
          {{ info.author }}
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props:['info']
}
</script>
<style lang="scss" scoped>
.bookinfo{
  .thumb{
    width: 750rpx;
    height: 500rpx;
    overflow: hidden;
    position: relative;
    .back{
      filter: blur(15px);
      width: 100%;

    }
    .img{
      position: absolute;
      height: 300rpx;
      width: 100%;
      left: 0;
      top: 30rpx;
    }
    .info{
      color: white;
      position: absolute;
      width: 100%;
      left: 0;
      top: 330rpx;
      text-align: center;
      .title{
        font-size: 20px;
      }
      .author{
        font-size: 14px
      }
    }
  }
}
</style>


