const connection = require('../app/database');
const { dateFormatFun } = require('../utils/utils');

const filterStatement = (alias, date) => {
  let dateFormat = dateFormatFun(date);
  // console.log('dateFormat', dateFormat);
  const statement = `
    SELECT
      FORMAT(SUM(amount), 2) AS '${alias}'
      FROM
      bills WHERE user_id = ? AND type = ?;
  `;
  const statementDate = `
    SELECT
      FORMAT(SUM(amount), 2) AS '${alias}'
      FROM bills WHERE user_id = ? AND type = ? AND
      DATE_FORMAT(createAt, '${dateFormat}') = ?;
  `;
  return dateFormat ? statementDate : statement;
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
      console.log('数据库插入数据失败', err);
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
      type AS type, id AS wid, pay_type AS payType, remark AS remark, FORMAT(amount, 2) AS amount, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') AS createTime
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
    const inParams = date ? [userId, 0, date] : [userId, 0];
    const outStatement = filterStatement('outAmount', date);
    const outParams = date ? [userId, 1, date] : [userId, 1];
    // console.log('inStatement', inStatement);
    try {
      // 收入
      const [inResult] = await connection.execute(inStatement, inParams);
      // 支出
      const [outResult] = await connection.execute(outStatement, outParams);
      const { inAmount } = inResult[0];
      const { outAmount } = outResult[0];
      return { inAmount: inAmount ? inAmount : '0.00', outAmount: outAmount ? outAmount : '0.00' };
    } catch (error) {
      console.log('查询收入支出数据出错', error);
      return false;
    }
  }

  async remove(id) {
    const statement =  `DELETE FROM bills WHERE id = ?`;
    try {
      const [ result ] = await connection.execute(statement, [id]);
      return result;
    } catch (err) {
      console.log("删除账单数据失败：", err);
      return false;
    }
  }

  async detail(id) {
    const statement = `
      SELECT
        DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') AS createTime, amount AS amount, remark AS remark, pay_type AS payType, type AS billType, id AS wid
      FROM bills WHERE id = ?;`;
    try {
      const [ result ] = await connection.execute(statement, [id]);
      return result;
    } catch (err) {
      console.log("查询账单详情失败：", err);
      return false;
    }
  }
}

module.exports = new BillService();
