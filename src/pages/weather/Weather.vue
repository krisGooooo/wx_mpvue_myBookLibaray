<template>
  <view class="wrapper" :style="'background: url(' + backgroundImage + ') center -178rpx / 100% no-repeat ' + backgroundColor + ';'">

    <view class="container" id="canvas-wrapper" :style="'padding-top: ' + paddingTop + 'px'">
      <view class="now">
        <!--当前实时天气和空气质量-->
        <view class="location" @click="chooseLocation">
          <Icon type="dingwei" otherType="location"></Icon>
          <text>{{ formatted_address }}</text>
        </view>
        <view class="air-quality" v-if="air.aqi">
          <text class="circle" :style="'background: ' + air.color "></text>
          <text class="value">{{ air.name }} {{ air.aqi }}</text>
        </view>
        <view class="now-weather">
          <view class="temp">
            <text>{{ current.temp }}</text>
            <text class="degree">°</text>
          </view>
          <view class="cur-weather">
            <view class="inline">
              <Icon :type="current.icon" otherType="cur-weather"></Icon>
              <text>{{ current.weather }}</text>
            </view>
            <view class="inline today">
              <text class="item">{{ humidityData }}</text>
              <text class="item">{{ windData }}</text>
            </view>
          </view>
          <view class="tips" v-if="tips">
            <text>{{tips}}</text>
          </view>
        </view>
      </view>
      <view class="two-days">
        <!--今明两天天气-->
        <view class="item">
          <view class="top">
            <text class="date">今天</text>
            <text class="temp">{{ today.temp }}</text>
          </view>
          <view class="bottom">
            <text>{{ today.weather }}</text>
            <Icon :type="today.icon" otherType="two-days"></Icon>
          </view>
        </view>
        <view class="item">
          <view class="top">
            <text class="date">明天</text>
            <text class="temp">{{ tomorrow.temp }}</text>
          </view>
          <view class="bottom">
            <text>{{ tomorrow.weather }}</text>
            <Icon :type="tomorrow.icon" otherType="two-days"></Icon>
          </view>
        </view>
      </view>
    </view>
    <view class="weather" :style="'background-color: ' + backgroundColor">
      <view class="container">
        <!--24 小时天气-->
        <scroll-view scroll-x class="hourly">
          <view class="scrollX">
            <view class="item" v-for="(item, index) in hourlyData" :key="index">
              <text class="time">{{ item.time }}</text>
              <Icon :type="item.icon" otherType="hourly"></Icon>
              <text class="temp">{{item.temp}}°</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="container">
        <view class="week">
          <!--七天天气-->
            <view class="week-weather">
              <view class="item" v-for="(item, index) in rendWeeklyData" :key="index">
                <view class="day">{{ item.formatDay }}</view>
                <view class="date">{{ item.formatDate }}</view>
                <view class="daytime">
                  <view class="wt">{{item.day}}</view>
                  <Icon :type="item.dayIcon" otherType="week"></Icon>
                </view>
                <view class="night">
                  <Icon :type="item.nightIcon" otherType="week"></Icon>
                  <view class="wt">{{item.night}}</view>
                </view>
                <view class="wind">{{ item.formatNightWind }}</view>
                <view class="wind" v-if="item.nightWind">{{ item.formatNightWindLevel }}</view>
                <view class="wind" v-else></view>
              </view>
            </view>
        </view>
      </view>
      <view class="container">
        <view class="life-style">
          <!--生活指数-->
          <view class="item" v-for="(item, index) in lifeStyle" :key="index" @click="indexDetail">
            <view class="title">
              <Icon :type="item.icon" otherType="life-style"></Icon>
              {{item.name}}
            </view>
            <view class="content">{{item.info}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import Icon from '@/components/Icon.vue'

export default {
  components:{
    Icon
  },
  computed:{
    humidityData(){
      return this.humidity(this.current.humidity)
    },
    windData(){
      return this.wind(this.current.wind, this.current.windLevel)
    },
    rendWeeklyData() {
      return this.weeklyData.map((item, index) => {
        item.formatDay = this.formatWeeklyDate(index);
        item.formatDate = this.formatDate(item.time);
        item.formatNightWind = this.wind(item.nightWind);
        item.formatNightWindLevel = this.windLevel(item.nightWindLevel);
        return item;
      });
    }

  },
  onLoad(){
    this.getLocation()
  },
  methods:{
    backHome() {
      wx.reLaunch({
        url: '../index/index',
      })
    },
    back() {
      wx.navigateBack({
        delta: 1
      })
    },
    getWeatherData (){

    },
    getLocation (e) {
      // sbDkbxiNZeOTOw8da0qlceLOfyv899OE
      wx.showLoading({
        title: '定位中',
        mask: true
      })
      const ak = 'sbDkbxiNZeOTOw8da0qlceLOfyv899OE'
      const url = 'http://api.map.baidu.com/geocoder/v2/'
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
                let {formatted_address, addressComponent} = res.data.result
                let {province, city, district: county} = addressComponent
                this.formatted_address = formatted_address
                this.province = province
                this.city = city
                this.county = county
                console.log(this.formatted_address, this.province, this.city, this.county)
              } else {
                // this.location = '未知地点'
                this.openLocation()
              }
              wx.hideLoading()
              this.getWeatherData()
            }
          })
        }
      })

    },
    // 检测到失败，则提示用户打开位置权限
    openLocation() {
      wx.showToast({
        title: '检测到您未授权使用位置权限，请先开启哦',
        icon: 'none',
        duration: 3000
      })
    },
    // 湿度处理
    humidity (h) {
      if (h) {
        return '湿度 ' + h + '%'
      }
      return h
    },
    // 根据风的 code 和风力输出文案
    wind (code, level) {
      if (!code) {
        return '无风'
      }
      if (level) {
        level = level.toString().split('-')
        level = level[level.length - 1]
        return code + ' ' + level + '级'
      }
      return code
    },
    windLevel(level) {
      if (level === '1-2') {
        return '微风'
      } else {
        return level + '级'
      }
    },
    formatWeeklyDate(i) {
      var now = new Date().getDate
      var names = ['今天', '明天', '后天']
      if (names[i]) {
        return names[i]
      }
      var curWeek = now.getDay() - 1 + i

      return WEEK_NAME[curWeek]
    },
    formatDate(ts) {
      var date = new Date(ts)
      var month = ('00' + (date.getMonth() + 1)).slice(-2)
      var day = ('00' + date.getDate()).slice(-2)
      console.log(month + '/' + day);
      
      return month + '/' + day
    },

  },
  data(){
    return{
      backgroundImage: require('../../images/cloud.jpg'),
      backImage: require('../../images/back.svg'),
      homeImage: require('../../images/home.svg'),
      backgroundColor: '#62aadc',
      formatted_address: '',
      province: '',
      city: '',
      county: '',
      paddingTop: '',
      "air": {
        "status": 0,
        "aqi": "77",
        "color": "#00cf9a",
        "name": "良"
      },
      "current": {
        "backgroundImage": "https://tianqi-1d3bf9.tcb.qcloud.la/bg/day/overcast.jpg",
        "backgroundColor": "#5c7a93",
        "temp": "35",
        "wind": "南风",
        "windLevel": "1",
        "weather": "阴",
        "humidity": "73",
        "icon": "yin",
        "ts": "2018-08-12 14:54"
      },
      "today": {
        "temp": "24/30°",
        "icon": "leizhenyu",
        "weather": "雷阵雨"
      },
      "tomorrow": {
        "temp": "24/30°",
        "icon": "leizhenyu",
        "weather": "雷阵雨"
      },
      // 24小时天气数据
      "hourlyData": [
        {
          "temp": "29",
          "time": "16:00",
          "weather": "雷阵雨",
          "icon": "leizhenyu"
        }
        // ...
      ],
      // 一周天气数据
      "weeklyData": [
        {
          "day": "雷阵雨",
          "dayIcon": "leizhenyu",
          "dayWind": "南风",
          "dayWindLevel": "1-2",
          "maxTemp": "30",
          "minTemp": "24",
          "night": "中雨",
          "nightIcon": "zhenyuye",
          "nightWind": "南风",
          "nightWindLevel": "1-2",
          "time": 1534032000000
        }
        // ...
      ],
      // 生活指数
      "lifeStyle": [
        {
          "name": "舒适度", // 指数名称
          "icon": "guominzhishu", // 指数对应的icon图标type
          "info": "较不舒适", // 指数数值
          // 指数的详情
          "detail": "白天虽然有雨，但仍无法削弱较高气温带来的暑意，同时降雨造成湿度加大会您感到有些闷热，不很舒适。"
        }
        // ...
      ]
    }
  },
  mounted(){
    // wx.setNavigationBarTitle({
    //   title: '天气情况'
    // })
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#4231ee',
    //   animation: {
    //     duration: 400,
    //     timingFunc: 'easeIn'
    //   }
    // })
    wx.getSystemInfo({
      success: (res) => {
        this.paddingTop = res.statusBarHeight + 12
      }
    })
  }
  
}
</script>
<style lang="scss" scoped>
  @import "./weather.scss";
</style>
<style lang="scss" scoped>


</style>


