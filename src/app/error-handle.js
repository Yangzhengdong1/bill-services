const errorType = require('../constant/error-type');
const errorHandle = (error, ctx) => {
  let status = 200,
    message,
    code;
  switch (error.message) {
    case errorType.ARGUMENT_IS_NOT_EMPTY:
      code = -1;
      message = '参数不能为空或参数缺失';
      break;
    case errorType.THIRD_PARTY_INTERFACE_ERROR:
      code = -1;
      message = '第三方接口请求失败';
      break;
    case errorType.DECRYPTION_FAILURE:
      code = -1;
      message = '解密失败';
      break;
    case errorType.INTERNAL_PROBLEMS:
      code = -1;
      message = '服务器内部错误';
      break;
    case errorType.ACCOUNT_NUMBER_AND_ID_DO_NOT_MATCH:
      code = -1;
      message = '当前账号名称与openid不一致';
      status = 400;
      break;
    case errorType.UNAUTHORIZED:
      code = -1;
      status = 400;
      message = '未授权';
      break;
    case errorType.INVALID_PARAMETER:
      code = -1;
      message = '非法参数';
      break;
    case errorType.THE_ACCOUNT_HAS_BEEN_BOUND:
      code = -1;
      message = '当前账号已被绑定';
      break;
    case errorType.NICKNAME_DUPLICATION:
      code = -1;
      message = '昵称重复';
      break;
    case errorType.USER_NOT_FOUND:
      code = -1;
      message = '用户未找到';
      break;
    case errorType.ERROR_INCORRECT_USERNAME_OR_PASSWORD:
      code = -1;
      message = '用户名或密码错误';
      break;
    default:
      status = 404;
      code = -1;
      message = 'NOT FOUND';
  }

  ctx.status = status;
  ctx.body = {
    code,
    message
  };
};

module.exports = errorHandle;
