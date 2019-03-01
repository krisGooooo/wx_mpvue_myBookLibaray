/*
 * @Author: krisGooooo
 * @Description: 获取豆瓣信息，入库
 * @Date: 2018-12-09 21:10:50
 * @LastEditors: krisGooooo
 * @LastEditTime: 2018-12-12 22:37:01
 */

const https = require('https')
const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
    const { isbn, openid } = ctx.request.body
    if (isbn && openid) {
        const findRes = await mysql('books').select().where('isbn', isbn)
        if (findRes.length) {
            ctx.state = {
                code: -1,
                data: {
                    msg: '图书已存在'
                }
            }
            return
        }
        let url = 'https://api.douban.com/v2/book/isbn/' + isbn
        const bookInfo = await getJSON(url)
        const rate = bookInfo.rating.average
        const { title, image, alt, publisher, summary, price } = bookInfo
        const tags = bookInfo.tags.map(v => {
            return `${v.title} ${v.count}`
        }).join(',')
        const author = bookInfo.author.join(',')
        try {
            console.log(mysql)
            await mysql('books').insert({
                isbn, openid, rate, title, image, alt, publisher, summary, price, tags, author
            })
            ctx.state.data = {
                title,
                msg: 'success'
            }
        } catch (e) {
            console.log(e)
            ctx.state = {
                code: -1,
                data: {
                    msg: '新增失败:' + e.sqlMessage
                }
            }
        }

        console.log({
        })
    }
}

/**
 * @msg: 获取豆瓣信息
 * @param {string}
 * @return: json
 */
function getJSON (url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let urlData = ''
            res.on('data', data => {
                urlData += data
            })
            res.on('end', data => {
                const bookInfo = JSON.parse(urlData)
                if (bookInfo.title) {
                    resolve(bookInfo)
                }
                reject(bookInfo)
            })
        })
    })
}
