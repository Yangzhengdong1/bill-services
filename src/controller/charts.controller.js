const errorType = require("../constant/error-type");
const {
  getIncomeAndExpend
} = require("../service/charts.service");
class ChartsController {
  async incomeAndExpend(ctx, next){
    const { startTime, endTime } = ctx.request.body.timeParams;
    const { userId } = ctx.request.body.user;
    const res = await getIncomeAndExpend(startTime, endTime, userId);
    if (!res) {
      const error = new Error(errorType.INTERNAL_PROBLEMS);
      ctx.app.emit("error", error, ctx);
      return;
    }
    ctx.body = {
      code: 0,
      data: res,
      message: "操作成功"
    }
  }
}

module.exports = new ChartsController();
