//  工具函数库

import config from './config'

//  Promise 封装 wx http 请求函数
// export function get(url) {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: config.host + url,
//       success(res) {
//         if (res.data.code === 0) {
//           resolve(res.data.data);
//         } else {
//           reject(res.data);
//         }
//       },
//     });
//   });
// }
export function get (url, data) {
  return request(url, 'GET', data)
}

export function post (url, data) {
  return request(url, 'POST', data)
}

function request (url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      url: config.host + url,
      success (res) {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          showModal('失败', res.data.data.msg)
          reject(res.data)
        }
      }
    })
  })
}

export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}

// 湿度处理
export function humidity (h) {
  if (h) {
    return '湿度 ' + h + '%'
  }
  return h
}
// 根据风的 code 和风力输出文案
export function wind (code, level) {
  if (!code) {
    return '无风'
  }
  if (level) {
    level = level.toString().split('-')
    level = level[level.length - 1]
    return code + ' ' + level + '级'
  }
  return code
}
export function windLevel(level) {
  if (level === '1-2') {
    return '微风'
  } else {
    return level + '级'
  }
}
export function formatWeeklyDate(i) {
  var now = getDate()
  var names = ['今天', '明天', '后天']
  if (names[i]) {
    return names[i]
  }
  var curWeek = now.getDay() - 1 + i

  return WEEK_NAME[curWeek]
}
export function formatDate(ts) {
  var date = getDate(ts)
  var month = ('00' + (date.getMonth() + 1)).slice(-2)
  var day = ('00' + date.getDate()).slice(-2)
  return month + '/' + day
}