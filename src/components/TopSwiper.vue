<!--
 * @Author: krisGooooo
 * @Description: 
 * @Date: 2019-02-27 19:06:34
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-02-27 20:35:51
 -->
<template>
  <div class="swiper">
    <swiper
      :indicator-dots="true"
      indicator-color="#EA5A49"
      :autoplay="true"
      :interval="6000"
      :duration="1000"
      :circular="true"
      >
      <div v-for="(top,imgIndex) in imgUrls" :key="imgIndex">
        <swiper-item>
          <img 
            mode="aspectFit"
            @click="bookDetail(img)" 
            v-for="img in top"
            :key="img.id"
            :src="img.image" 
            class="slide-image">
        </swiper-item>
      </div>
    </swiper>
  </div>
</template>
<script>
export default {
  props: ['tops'],
  computed: {
    imgUrls () {
      const res = this.tops
      return [res.slice(0, 3), res.slice(3, 6), res.slice(6)]
    }
  },
  methods: {
    bookDetail (item) {
      wx.navigateTo({
        url: `/pages/detail/main?id=${item.id}`
      })
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss" scoped>
.swiper{
  margin-top: 5px;
  .slide-image{
    width: 33%;
    height: 250rpx;
  }
}
</style>

