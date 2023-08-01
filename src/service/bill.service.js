const connection = require('../app/database');

class BillService {
  async create(params) {
    const { payType, billType, amount, userId, remark } = params;
    const statement = `INSERT INTO bills(type, pay_type, remark, user_id, amount) VALUES(?, ?, ?, ?, ?);`;
    try {
      const [ result ] = await connection.execute(statement, [billType, payType, remark, userId, amount]);
      return result;
    } catch(err) {
      console.log('数据库插入数据失败');
      return false;
    }
  }

  async getBillList(params) {
    const { offset, size, userId, date } = params;
    // 可选参数 date、payType、billType
    let optionalStatement = '';
    let queryField = [userId, offset, size];
    const dateStatement = "AND DATE_FORMAT(createAt, '%Y-%m-%d') = DATE_FORMAT(?,'%Y-%m-%d')";
    if (date) {
      optionalStatement = dateStatement;
      queryField = [userId, date, offset, size];
    }
    const statement = `
      SELECT 
      type AS type, pay_type AS payType, remark AS remark, amount AS amount 
      FROM bills 
      WHERE user_id = ? ${optionalStatement} LIMIT ?, ?;
    `;
    try {
      const [ result ] = await connection.execute(statement, queryField);
      return result;
    } catch (err) {
      console.log('数据库查询账单失败', err);
      return false;
    }

  }
}



module.exports = new BillService();