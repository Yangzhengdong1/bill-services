const moment = require('moment');
moment.locale('zh-cn');


/**
 * @description: 根据参数转化格式
 * @param {*} date 时间
 * @return {*} 返回格式
 */
const dateFormatFun = (date) => {
  if (!date) {
    return null;
  }
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
  return dateFormat;
};


/**
 * @description: 时间戳格式转化
 * @param {*} date 时间戳
 * @param {*} format 转化格式
 * @return {*} 返回转化后的字符串
 */
const nowDateFormatTool = (date, format) => {
  return moment(date).format(format);
};


module.exports = {
  dateFormatFun,
  nowDateFormatTool
};
