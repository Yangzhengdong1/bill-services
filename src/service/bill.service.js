const connection = require('../app/database');

const filterStatement = (alias, date) => {
  let dateFormat = '';
  const dateLength = date.split('-').length;
  switch (dateLength) {
    case 1:
      dateFormat = '%Y';
      break;
    case 2:
      dateFormat = '%Y-%m';
      break;
    case 3:
      dateFormat = '%Y-%m-%d';
      break;
    default:
      break;
  }
  const statement = `
    SELECT 
    SUM(amount) AS '${alias}' 
    FROM bills WHERE 
    user_id = ? AND 
    type = ? AND 
    DATE_FORMAT(createAt, '${dateFormat}') = ?;
  `;
  return statement;
};

class BillService {
  /**
   * @description: 数据库中创建一条账单数据
   * @param {*} params {payType, billType, amount, userId, remark}
   * @return {*} 返回数据库插入结果
   */
  async create(params) {
    const { payType, billType, amount, userId, remark } = params;
    const statement = `
      INSERT INTO bills(type, pay_type, remark, user_id, amount) VALUES(?, ?, ?, ?, ?);
    `;
    try {
      const [ result ] = await connection.execute(statement, [billType, payType, remark, userId, amount]);
      return result;
    } catch (err) {
      console.log('数据库插入数据失败');
      return false;
    }
  }

  /**
   * @description: 查询数据库账单列表
   * @param {*} params {offset, size, userId, date, dateFormat:格式(年-月-日)，[,payType[,billType]]}
   * @return {*} 返回数据库查询结果
   */
  async getBillList(params) {
    const { offset, size, userId, date, dateFormat } = params;
    // 可选参数 date、payType、billType
    let optionalStatement = '';
    let queryField = [userId, offset, size];
    const dateStatement = `AND DATE_FORMAT(createAt, '${dateFormat ? dateFormat : '%Y-%m-%d'}') = ?`;
    if (date) {
      optionalStatement = dateStatement;
      queryField = [userId, date, offset, size];
    }
    const statement = `
      SELECT 
      type AS type, pay_type AS payType, remark AS remark, amount AS amount, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') AS createTime
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

  /**
   * @description: 查询收入支出
   * @param {*} params{ userId, date:'2023-09-06' }
   * @return {*} 返回数据库查询结果
   */
  async getAmount(params) {
    const { userId, date } = params;
    const inStatement = filterStatement('inAmount', date);
    const outStatement = filterStatement('outAmount', date);
    try {
      // 收入
      const [inResult] = await connection.execute(inStatement, [userId, 0, date]);
      // 支出
      const [outResult] = await connection.execute(outStatement, [userId, 1, date]);
      const { inAmount } = inResult[0];
      const { outAmount } = outResult[0];
      return { inAmount: inAmount ? inAmount : 0, outAmount: outAmount ? outAmount : 0 };
    } catch (error) {
      console.log('查询收入支出数据出错', error);
      return false;
    }
  }
}

module.exports = new BillService();
