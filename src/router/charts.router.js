const KoaRouter = require("koa-router");

const { timeParamsVerify } = require("../middleware/charts.middleware");
const { authVerify } = require("../middleware/auth.middleware");
const { incomeAndExpend } = require("../controller/charts.controller");


const chartsRouter = new KoaRouter({prefix: "/charts"});

chartsRouter.get("/income-and-expend-pie", authVerify, timeParamsVerify, incomeAndExpend);

module.exports = chartsRouter;

