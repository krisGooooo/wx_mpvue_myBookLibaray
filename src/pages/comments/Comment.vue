<!--
 * @Author: krisGooooo
 * @Description: 
 * @Date: 2018-11-28 23:04:09
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-03-01 15:33:06
 -->
<template>
    <div class="container">
        <CommentList v-if="userinfo.openId" :comments="comments" type="user"></CommentList>
        <div v-if="userinfo.openId">
            <div class="page-title">
                我的图书
            </div>
            <Card v-for="book in books" :key="book.id" :book="book">
                
            </Card>
            <div v-if="!books.length">
                暂时还没添加过任何图书
            </div>
        </div>
    </div>
</template>

<script>
import { get } from '@/util'
import CommentList from '@/components/CommentList'
import Card from '@/components/Card'
export default {
  data () {
    return {
      comments: [],
      books: [],
      userinfo: {}
    }
  },
  components: {
    CommentList,
    Card
  },
  methods: {
    async getComments () {
      const comments = await get('/weapp/commentlist', {
        openid: this.userinfo.openId
      })
      this.comments = comments.list
    },
    async getBooks () {
      const books = await get('/weapp/booklist', {
        openid: this.userinfo.openId
      })
      this.books = books.list
    },
    init () {
      wx.showNavigationBarLoading()
      this.getComments()
      this.getBooks()
      wx.hideNavigationBarLoading()
    }
  },
  onPullDownRefresh () {
    this.init()
    wx.stopPullDownRefresh()
  },
  onShow () {
    if (!this.userinfo.openId) {
      let userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        this.userinfo = userinfo
        this.init()
      }
    }
  }
}
</script>

<style>

</style>
