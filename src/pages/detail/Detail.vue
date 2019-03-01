<!--
 * @Author: krisGooooo
 * @Description: 
 * @Date: 2019-02-27 18:34:41
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-03-01 12:19:49
 -->
<template>
  <div>
    <BookInfo :info="info"></BookInfo>
    <CommentList :comments="comments"></CommentList>
    <div class="comment" v-if="showAdd">
      <textarea v-model="comment"
                class="textarea"
                :maxlength="100"
                placeholder="请输入图书短评"
                ></textarea>
      <div class="location">
        地理位置：
        <switch color="#EA5A49" :checked="location" @change="getGeo"></switch>
        <span class="text-primary">{{ location }}</span>
      </div>
      <div class="phone">
        手机型号：
        <switch color="#EA5A49" :checked="phone" @change="getPhone"></switch>
        <span class="text-primary">{{ phone }}</span>
      </div>
      <button class="btn" @click="addComment">
        评论
      </button>
    </div>
    <div v-else class="text-footer">
      未登录或已评论
    </div>
    <button class="btn" open-type="share">
      转发给好友
    </button>
  </div>
</template>
<script>
import { get, post, showModal } from '@/util'
import BookInfo from '@/components/BookInfo'
import CommentList from '@/components/CommentList'

export default {
  components: {
    BookInfo,
    CommentList
  },
  data () {
    return {
      bookid: '',
      info: {},
      comment: '',
      location: '',
      phone: '',
      userinfo: {},
      comments: []
    }
  },
  computed: {
    showAdd () {
      if (!this.userinfo.openId) {
        return false
      }
      if (this.comments.filter(v => v.openid === this.userinfo.openId).length) {
        return false
      }
      return true
    }
  },
  methods: {
    async addComment () {
      if (!this.comment) {
        return
      }
      const data = {
        openid: this.userinfo.openId,
        bookid: this.bookid,
        comment: this.comment,
        phone: this.phone,
        location: this.location
      }
      try {
        await post('/weapp/addcomment', data)
        this.comment = ''
        this.getComments()
      } catch (e) {
        showModal('失败', e.msg)
      }
      console.log(data)
    },
    async getDetail () {
      const info = await get('/weapp/bookdetail', { id: this.bookid })
      wx.setNavigationBarTitle({
        title: info.title
      })
      this.info = info
    },
    async getComments () {
      const comments = await get('/weapp/commentlist', { bookid: this.bookid })
      this.comments = comments.list || []
    },
    getGeo (e) {
      // sbDkbxiNZeOTOw8da0qlceLOfyv899OE
      const ak = 'sbDkbxiNZeOTOw8da0qlceLOfyv899OE'
      const url = 'http://api.map.baidu.com/geocoder/v2/'
      if (e.target.value) {
        wx.getLocation({
          success: (geo) => {
            wx.request({
              url,
              data: {
                location: `${geo.latitude},${geo.longitude}`,
                output: 'json',
                ak
              },
              success: (res) => {
                if (res.data.status === 0) {
                  this.location = res.data.result.addressComponent.city
                } else {
                  this.location = '未知地点'
                  // console.log('')
                }
              }
            })
          }
        })
      } else {
        this.location = ''
      }
    },
    getPhone (e) {
      if (e.target.value) {
        const phoneInfo = wx.getSystemInfoSync()
        this.phone = phoneInfo.model
      } else {
        this.phone = ''
      }
    }

  },
  mounted () {
    this.bookid = this.$root.$mp.query.id
    this.getDetail()
    this.getComments()
    wx.showShareMenu()
    const userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
  },
  onShareAppMessage () {
    return {
      title: '沃德图书'
    }
  }
}
</script>
<style lang="scss" scoped>
.comment{
  margin-top: 10px;
  .textarea{
    width: 730rpx;
    height: 200rpx;
    background: #eee;
    padding: 10rpx;
  }
  .location{
    margin-top: 10px;
    padding: 5px 10px;
  }
  .phone{
    margin-top: 10px;
    padding: 5px 10px;
  }
}
</style>


