const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  const {id} = ctx.request.query
  const detail = await mysql('books')
                        .select()
                        .where('id',id)
                        .first()
  ctx.state.data = detail
  await mysql('books')
          .where('id',id)
          .increment('count',1)
}