/*
 * @Author: krisGooooo
 * @Description: 获取豆瓣信息，入库
 * @Date: 2018-12-09 21:10:50
 * @LastEditors: krisGooooo
 * @LastEditTime: 2018-12-11 22:36:09
 */

const https = require('https')

module.exports = async (ctx) => {
  const { isbn, open_id } = ctx.request.body
  if(isbn && open_id){
    let url = 'https://api.douban.com/v2/book/isbn/' + isbn
    const bookInfo = await getJSON(url)
    const rate = bookInfo.rating.average
    const { title, image, alt, publisher, summary, price} = bookInfo
    const tags = bookInfo.tags.map(v=>{
      return `${v.title} ${v.count}`
    }).join(',')
    const author = bookInfo.author.join(',')
    console.log({
      rate, title, image, alt, publisher, summary, price,tags,author
    })
  }
}

/**
 * @msg: 获取豆瓣信息
 * @param {string}
 * @return: json
 */
function getJSON(url){
  return new Promise((resolve, reject) => {
    https.get(url,res=>{
      let urlData = ''
      res.on('data', data => {
        urlData += data
      })
      res.on('end', data => {
        const bookInfo = JSON.parse(urlData)
        if(bookInfo.title){
          resolve(bookInfo)
        }
        reject(bookInfo)
      })
    })
  })
}