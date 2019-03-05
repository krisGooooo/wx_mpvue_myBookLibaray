<template>
  <view class="wrapper" :style="'background: url(' + backgroundImage + ') center -178rpx / 100% no-repeat ' + backgroundColor + ';'">

    <view class="container" id="canvas-wrapper" :style="'padding-top: ' + paddingTop + 'px'">
      <view class="now">
        <!--当前实时天气和空气质量-->
        <view class="location" @click="chooseLocation">
          <!-- <Icon type="dingwei" otherType="location"></Icon> -->
          <text>{{ formatted_address }}</text>
        </view>
        <view class="air-quality" v-if="air.aqi">
          <text class="circle" :style="'background: ' + air.color "></text>
          <text class="value">{{ air.name }} {{ air.aqi }}</text>
        </view>
        <view class="now-weather">
          <view class="temp">
            <text>{{ now.tmp }}</text>
            <text class="degree">°</text>
          </view>
          <view class="cur-weather">
            <view class="inline">
              <!-- <Icon :type="now.cond_code" otherType="cur-weather"></Icon> -->
              <img :src="now.image">
              <text>{{ now.cond_txt }}</text>
            </view>
            <view class="inline today">
              <text class="item">{{ '湿度 ' + now.hum + '%' }}</text>
              <text class="item">{{ now.wind_dir + ' '  + now.wind_sc + '级'}}</text>
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
            <text class="temp">{{ today.tmp_min + '/' + today.tmp_max + '°'}}</text>
          </view>
          <view class="bottom">
            <text>{{ today.cond_txt_n }}</text>
            <img :src="today.image">
            <!-- <Icon :type="today.cond_code_n"></Icon> -->
          </view>
        </view>
        <view class="item">
          <view class="top">
            <text class="date">明天</text>
            <text class="temp">{{ tomorrow.tmp_min + '/' + tomorrow.tmp_max + '°' }}</text>
          </view>
          <view class="bottom">
            <text>{{ tomorrow.cond_txt_n }}</text>
            <img :src="tomorrow.image">

            <!-- <Icon :type="tomorrow.icon" otherType="two-days"></Icon> -->
          </view>
        </view>
      </view>
    </view>
    <view class="weather" :style="'background-color: ' + backgroundColor">
      <view class="container">
        <!--24 小时天气-->
        <scroll-view scroll-x class="hourly">
          <view class="scrollX">
            <view class="item" v-for="(item, index) in hourly" :key="index">
              <text class="time">{{ item.time }}</text>
              <!-- <Icon :type="item.icon" otherType="hourly"></Icon> -->
              <img :src="item.image">
              <text class="temp">{{item.tmp}}°</text>
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
                  <!-- <Icon :type="item.dayIcon" otherType="week"></Icon> -->
                </view>
                <view class="night">
                  <!-- <Icon :type="item.nightIcon" otherType="week"></Icon> -->
                  <view class="wt">{{item.night}}</view>
                </view>
                <view class="wind">{{ item.formatNightWind }}</view>
                <view class="wind" v-if="item.nightWind">{{ item.formatNightWindLevel }}</view>
                <view class="wind" v-else></view>
              </view>
            </view>
            <view class="week-chart">
              <canvas canvas-id="chart" id="chart"></canvas>
            </view>
        </view>
      </view>
      <view class="container">
        <view class="life-style">
          <!--生活指数-->
          <view class="item" v-for="(item, index) in lifeStyle" :key="index" @click="indexDetail">
            <view class="title">
              <!-- <Icon :type="item.icon" otherType="life-style"></Icon> -->
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
import { log } from 'util';
// import {fixChart, getChartConfig, drawEffect} from '@/lib/utils'
// import Chart from '@/lib/chartjs/chart'

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
      return this.daily_forecast.map((item, index) => {
        item.formatDay = this.formatWeeklyDate(index);
        item.formatDate = this.formatDate(item.date);
        return item;
      });
    }

  },
  onLoad(){
    this.getLocation()
  },
  methods:{
    // drawChart() {
    //   const {width, scale, weeklyData} = this.data
    //   let height = CHART_CANVAS_HEIGHT * scale
    //   let ctx = wx.createCanvasContext('chart')
    //   fixChart(ctx, width, height)

    //   // 添加温度
    //   Chart.pluginService.register({
    //     afterDatasetsDraw(e, t) {
    //       ctx.setTextAlign('center')
    //       ctx.setTextBaseline('middle')
    //       ctx.setFontSize(16)

    //       e.data.datasets.forEach((t, a) => {
    //         let r = e.getDatasetMeta(a)
    //         r.hidden ||
    //           r.data.forEach((e, r) => {
    //             // 昨天的数据发灰
    //             ctx.setFillStyle(r === 0 ? '#e0e0e0' : '#ffffff')
    //             // 增加温度符号
    //             let i = t.data[r].toString() + '\xb0'
    //             let o = e.tooltipPosition()
    //             // 计算文字位置
    //             0 == a ? ctx.fillText(i, o.x + 2, o.y - 8 - 10) : 1 == a && ctx.fillText(i, o.x + 2, o.y + 8 + 10)
    //           })
    //       })
    //     }
    //   })

    //   return new Chart(ctx, getChartConfig(weeklyData))
    // },
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
    chooseLocation() {
      wx.chooseLocation({
        success: (res) => {
          let {latitude, longitude} = res
          this.latitude = latitude
          this.longitude = longitude
          this.getLocation(res)
          this.getWeatherData()

        }
      })
    },
    getWeatherData (){
      const key = '91d2a3a94c4b42cab67b71f798c2e494'
      const url = 'https://free-api.heweather.net/s6/weather'
      wx.request({
        url,
        data: {
          location: `${this.latitude},${this.longitude}`,
          key,
          unit: 'm'
        },
        success: (res) => {
          console.log(res)
          this.render(res.data.HeWeather6[0])
        }
      })
    },
    render(data){
      const {hourly, basic, daily_forecast, lifestyle, now} = data
      this.hourly = hourly
      this.hourly.forEach(e => {
        e.time = e.time.slice(10)
        e.image = require("../../images/" + e.cond_code + '.png')
      })
      this.basic = basic
      this.daily_forecast = daily_forecast
      this.lifestyle = lifestyle
      this.now = now
      // '../../images/cloud.jpg')
      this.now.image = require("../../images/" + this.now.cond_code + '.png')
      console.log(this.now.image)
      this.today = daily_forecast[0]
      this.today.image = require("../../images/" + this.today.cond_code_n + '.png')
      this.tomorrow = daily_forecast[1]
      this.tomorrow.image = require("../../images/" + this.tomorrow.cond_code_n + '.png')
      
      // console.table({hourly, basic, daily_forecast, lifestyle, now})
      

      // console.log({hourly, daily, current, lifeStyle, oneWord, effect});
      // this.current = now
      
      // const {backgroundColor, backgroundImage} = current

      // const _today = daily[0],
      //   _tomorrow = daily[1]
      // const today = {
      //   temp: `${_today.minTemp}/${_today.maxTemp}°`,
      //   icon: _today.dayIcon,
      //   weather: _today.day
      // }
      // const tomorrow = {
      //   temp: `${_tomorrow.minTemp}/${_tomorrow.maxTemp}°`,
      //   icon: _tomorrow.dayIcon,
      //   weather: _tomorrow.day
      // }
    },
    getLocation (e) {
      // sbDkbxiNZeOTOw8da0qlceLOfyv899OE
      wx.showLoading({
        title: '定位中',
        mask: true
      })
      const ak = 'sbDkbxiNZeOTOw8da0qlceLOfyv899OE'
      const url = 'http://api.map.baidu.com/geocoder/v2/'
      if(e){
        wx.request({
          url,
          data: {
            location: `${e.latitude},${e.longitude}`,
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
              this.openLocation()
            }
            wx.hideLoading()
            this.getWeatherData()
          }
        })
      }else{
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
                  this.latitude = geo.latitude
                  this.longitude = geo.longitude
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
      }


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
      var now = new Date()
      var WEEK_NAME = ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
      console.log('now', now)
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
      latitude: '',
      longitude: '',
      hourly: {}, 
      basic: {}, 
      daily_forecast: [], 
      lifestyle: {}, 
      today: {},
      tomorrow: {},
      now: {},
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
    wx.getSystemInfo({
      success: (res) => {
        this.paddingTop = res.statusBarHeight + 12
      }
    })
  },
  onPullDownRefresh() {
    this.getWeatherData()
    wx.stopPullDownRefresh()

  }
  
}
</script>
<style lang="scss" scoped>
  @import "./weather.scss";
</style>
<style lang="scss" scoped>
img{
  width: 34rpx;
  height: 34rpx;
}
.cur-weather{
  img{
    margin-right: 10rpx;
    display:inline-block;
  }
}
.two-days{
  img {
    float: right;
  }
}
.hourly {
  img {
    margin: 30rpx auto 30rpx;
  }
}
</style>


