<script>
import { get } from './util';
import qcloud from 'wafer2-client-sdk'
import config from './config'

export default {
  //  async await 异步编程解决方案
  async created() {
    console.log('启动了小程序');
  },
};
</script>

<style>
.text-primary{
  color: #EA5149;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
.btn {
  color: white;
  background: #EA5A49;
  margin-bottom: 10px;
  padding-left: 15px;
  border-radius: 2px;
  font-size: 16px;
  line-height: 40px;
  height: 40px;
  width: 100%;
}
.btn:active {
  background: #FA5A49;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
