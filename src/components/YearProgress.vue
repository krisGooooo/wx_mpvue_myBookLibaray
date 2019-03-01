<template>
  <div class="processbar">
    <progress :percent="percent" activeColor="#EA5A49"></progress>
    <p>{{year}}已经过去了{{days}}天,{{percent}}%</p>
  </div>
</template>

<script>
export default {
  methods: {
    isLeapYear () {
      const year = new Date().getFullYear()
      if (year % 400 === 0) {
        return true
      } else if (year % 4 === 0 && year % 100 !== 0) {
        return true
      }
      return false
    },
    getDayOfYear () {
      return this.isLeapYear() ? 366 : 365
    }
  },
  computed: {
    year () {
      return new Date().getFullYear()
    },
    days () {
      const start = new Date()
      start.setMonth(0)
      start.setDate(1)
      //  start 是今年第一天
      const offset = new Date().getTime() - start.getTime()
      return parseInt(offset / 1000 / 60 / 60 / 24) + 1
    },
    percent () {
      return (this.days * 100 / this.getDayOfYear()).toFixed(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.processbar {
  text-align: center;
  margin-top: 10rpx;
  width: 100%;
  progress {
    margin-bottom: 10rpx;
  }
}
</style>


