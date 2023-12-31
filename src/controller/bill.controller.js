const { create, getBillList, getAmount } = require('../service/bill.service');
const errorType = require('../constant/error-type');
const { dateFormatFun, nowDateFormatTool } = require('../utils/utils');

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
    // const userId = 1;
    const { offset, size, date } = ctx.query.listParams;
    const dateFormat = dateFormatFun(date);
    const result = await getBillList({ offset, size, date, userId, dateFormat });
    // 拿到当前时间，去获取账单
    const nowDate = new Date();
    let day = nowDateFormatTool(nowDate, 'YYYY-MM-DD');
    let month = nowDateFormatTool(nowDate, 'YYYY-MM');
    let year = nowDateFormatTool(nowDate, 'YYYY');
    let amountDay = await getAmount({userId, date: day});
    let amountMoth = await getAmount({userId, date: month});
    let amountYear = await getAmount({userId, date: year});
    // let amount = await getAmount({userId, date});
    // amount = amount ? amount : {};
    if (!result) {
      const errorMessage = new Error(errorType.INTERNAL_PROBLEMS);
      ctx.app.emit('error', errorMessage, ctx);
      return;
    }
    ctx.body = {
      code: 0,
      data: {
        records: result,
        amount: {
          amountDay: amountDay ? amountDay : {},
          amountMoth: amountMoth ? amountMoth : {},
          amountYear: amountYear ? amountYear : {}
        }
      },
      message: '账单列表获取成功'
    };
  }

  async amount(ctx) {
    const { userId } = ctx.request.body.user;
    // const userId = 1;
    const { date } = ctx.query;
    // console.log('aaaaaaaaa', date, userId);
    const result = await getAmount({userId, date});
    ctx.body = {
      code: 0,
      data: {
        amount: result ? result : {}
      },
      message: '请求成功'
    };
  }
}

module.exports = new BillController();
