const { create, getBillList } = require('../service/bill.service');
const errorType = require('../constant/error-type');

class BillController {
  async create(ctx) {
    const { payType, billType, amount, remark, user } = ctx.request.body;
    const { userId } = user;
    const params = { payType, billType, amount, remark, userId };
    // 存入数据库
    const result = await create(params);
    if (result) {
      ctx.body = { code: 0, message: '新增账单成功' };
    } else {
      const error = new Error(errorType.INTERNAL_PROBLEMS);
      ctx.app.emit('error', error, ctx);
    }
  }

  async list(ctx) {
    const { userId } = ctx.request.body.user;
    const { offset, size, date } = ctx.query.listParams;
    const result = await getBillList({ offset, size, date, userId });
    if (!result) {
      const errorMessage = new Error(errorType.INTERNAL_PROBLEMS);
      ctx.app.emit('error', errorMessage, ctx);
      return;
    }
    ctx.body = {
      code: 0,
      data: result,
      message: '账单列表获取成功'
    };
  }

}

module.exports = new BillController();