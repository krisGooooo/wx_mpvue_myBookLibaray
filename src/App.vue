<script>
export default {
  //  async await 异步编程解决方案
  async created () {
    console.log('启动了小程序')
  }
}
</script>

<style>
.text-footer{
  text-align: center;
  font-size: 12px;
  margin-bottom: 5px;
}
.text-primary{
  color: #EA5149;
}
.page-title{
  padding-left: 20px;
  background: #eee;
  line-height: 40px;
  font-size: 14px;
}
.right{
  float: right;
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
