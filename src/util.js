//  工具函数库

import config from './config';

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
export function get(url, data){
  return request(url, 'GET', data)
}

export function post(url, data){
  return request(url, 'POST', data)
}

function request(url, method, data){
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      url: config.host + url,
      success(res) {
        if (res.data.code === 0) {
          console.log(res.data)
          resolve(res.data.data);
        } else {
          console.log(1)
          reject(res.data);
        }
      },
    });
  });
}