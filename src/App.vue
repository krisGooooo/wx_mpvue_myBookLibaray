<script>
import { get } from './util';

export default {
  //  async await 异步编程解决方案
  async created() {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);
    const res = await get('/weapp/demo');
    console.log(123, res);
    console.log('启动了小程序');
  },
};
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
