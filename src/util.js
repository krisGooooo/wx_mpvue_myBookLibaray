//  工具函数库

import config from './config';

//  Promise 封装 wx http 请求函数
export function get(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      success(res) {
        if (res.data.code === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data);
        }
      },
    });
  });
}
