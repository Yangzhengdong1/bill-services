const connection = require("../app/database");
class ChartsService {
  async getIncomeAndExpend(startTime, endTime, userId) {
    const statement = `
      SELECT
        type,
        ROUND( SUM( amount ), 2 ) AS totalNum,
        FORMAT( SUM( amount ), 2 ) AS totalStr,
        CONCAT(
          ROUND(
            SUM( amount ) / ( SELECT SUM( amount ) FROM bills WHERE user_id = 1 AND createAt BETWEEN ? AND ? ) * 100,
            2
          ),
          '%'
        ) AS per,
        CASE
        type
        WHEN 0 THEN
        '收入'
        WHEN 1 THEN
        '支出'
        END AS typeName
      FROM bills
      WHERE user_id = ? AND createAt BETWEEN ? AND ?
      GROUP BY type;
    `;
    try {
      const [res] = await connection.execute(statement, [startTime, endTime, userId, startTime, endTime]);
      return res;
    } catch (err) {
      console.log("查询收入支出占比出错：", err);
      return false;
    }
  }
}

module.exports = new ChartsService();
