<template>
  <div class="container">
    <div class="userinfo" >
      <img :src="userinfo.avatarUrl" alt="">
      <p>{{userinfo.nickName}}</p>
    </div>
    <YearProgress></YearProgress>
    <button v-if='userinfo.openId' @click='scanBook' class='btn'>添加图书</button>
    <button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">点击登录</button>
    <button @click='goWeather' class='btn'>看看天气</button>

  </div>
</template>
<script>
import qcloud from 'wafer2-client-sdk'
import YearProgress from '@/components/YearProgress'
import HeaderBar from '@/components/HeaderBar'
import { post, showModal } from '@/util'
import config from '@/config'

export default {
  components: {
    YearProgress,
    HeaderBar
  },
  data () {
    return {
      userinfo: {
        avatarUrl: 'http://image.shengxinjing.cn/rate/unlogin.png',
        nickName: ''
      },
      paddingTop: ''
    }
  },
  methods: {
    goWeather(){
      wx.navigateTo({
        url: '/pages/weather/main'
      })
    },
    async addBook (isbn) {
      const res = await post('/weapp/addbook', {
        isbn,
        openid: this.userinfo.openId
      })
      showModal('添加成功', `${res.title}添加成功`)
    },
    scanBook () {
      wx.scanCode({
        success: (res) => {
          console.log(res)
          if (res.result) {
            this.addBook(res.result)
          }
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    loginSuccess (res) {
    //   showSuccess('登录成功')
      wx.setStorageSync('userinfo', res)
      this.userinfo = res
    },
    login () {
      wx.showToast({
        title: '登录中',
        icon: 'loading'
      })
      qcloud.setLoginUrl(config.loginUrl)
      const session = qcloud.Session.get()
      if (session) {
        qcloud.loginWithCode({
          success: (res) => {
            console.log('没过期的登录', res)
            this.loginSuccess(res)
          },
          fail: (err) => {
            console.error(err)
          }
        })
      } else {
        qcloud.login({
          success: (res) => {
            console.log('登录成功', res)
            this.loginSuccess(res)
          },
          fail: (err) => {
            console.error(err)
          }
        })
      }
    }
  },
  onShow () {
    wx.showShareMenu()
    const userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
  },
  mounted(){
    wx.getSystemInfo({
      success: (res) => {
        this.paddingTop = res.statusBarHeight + 12
      }
    })
  }
}
</script>

<style lang='scss'>
.container{
  padding:0 30rpx;
}  
.userinfo{
  margin-top:100rpx;
  text-align:center;
  img{
    width: 150rpx;
    height:150rpx;
    margin: 20rpx;
    border-radius: 50%;
  }
}
</style>