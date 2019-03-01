<!--
 * @Author: krisGooooo
 * @Description: 图书页
 * @Date: 2018-11-28 23:04:09
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-02-27 19:06:47
 -->
<template>
    <div>
        <TopSwiper :tops="tops">

        </TopSwiper>
        <Card v-for="book in books" :key="book.id" :book="book"></Card>
        <p class="text-footer" v-if="!more">
            没有更多数据
        </p>
    </div>
</template>

<script>
import { get } from '@/util'
import Card from '@/components/Card'
import TopSwiper from '@/components/TopSwiper'

export default {
  components: {
    Card,
    TopSwiper
  },
  data () {
    return {
      books: [],
      page: 0,
      more: true,
      tops: []
    }
  },
  methods: {
    //  获取图书列表
    async getList (init) {
      if (init) {
        this.page = 0
        this.more = true
      }
      //  打开 wx 导航栏的loading
      wx.showNavigationBarLoading()
      const book = await get('/weapp/booklist', { page: this.page })
      if (book.list.length < 10 && this.page > 0) {
        this.more = false
      }
      if (init) {
        this.books = book.list
        wx.stopPullDownRefresh()
      } else {
        console.log(1)
        this.books = this.books.concat(book.list)
        console.log(this.books)
      }
      //  关闭 loading 状态3
      wx.hideNavigationBarLoading()
    },
    async getTop () {
      const tops = await get('/weapp/top')
      this.tops = tops.list
    }
  },
  //  下拉刷新列表
  onPullDownRefresh () {
    this.getList(true)
    this.getTop()
  },
  onReachBottom () {
    if (!this.more) {
      return false
    }
    this.page = this.page + 1
    this.getList()
  },
  mounted () {
    this.getList(true)
    this.getTop()
  }
}
</script>

<style>

</style>
