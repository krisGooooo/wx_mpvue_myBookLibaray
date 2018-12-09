//  获取豆瓣信息，入库
const https = require('https')

module.exports = async (ctx) => {
  console.log(ctx.request.body)
  const { isbn, open_id } = ctx.request.body
  console.log(isbn, open_id)
  if(isbn && open_id){
    console.log(123)
    let url = 'https://api.douban.com/v2/book/isbn/' + isbn
    const bookInfo = await getJSON(url)
    console.log(bookInfo)
  }
}

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