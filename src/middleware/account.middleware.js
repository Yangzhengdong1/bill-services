const axios = require('axios');

const { APPID, SECRET, GRANT_TYPE } = require("../app/config");
const errorType = require("../constant/error-type");
const { queryUser, register } = require('../service/account.service');
const WXBizDataCrypt = require("../utils/WXBizDataCrypt");

// 获取微信凭证
const getWXProof = async (ctx, code) => {
  try {
    // 向微信发起请求，获取openid(用户唯一标识符)和session_key(解密encryptedData/校验用户信息)
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${ APPID }&secret=${ SECRET }&js_code=${ code }&grant_type=${ GRANT_TYPE }`;
    const res = await axios.get(url);
    if (res && res.data.openid) {
      return res.data;
    } else {
      throw new Error('获取openid失败');
    }
  } catch(error) {
    return false;
  }
}

// 解密微信用户信息
const decryption = (session_key, encryptedData, iv) => {
  try {
    const pc = new WXBizDataCrypt(APPID, session_key);
    return pc.decryptData(encryptedData, iv);
  } catch (err) {
    return false
  }
}

// 错误处理
const handleError = (errorMessage, logMessage, ctx) => {
  console.log(logMessage);
  const error = new Error(errorMessage);
  ctx.app.emit('error', error, ctx);
}

class AccountMiddleware {
  async queryUserForLogin(ctx, next) {
    const { code, encryptedData, iv, password, username } = ctx.request.body;
    // 判断登录方式：pwd/code
    if (code && encryptedData) {
      if ( !code || !encryptedData || !iv ) {
        handleError(errorType.ARGUMENT_IS_NOT_EMPTY, 'ctx', ctx);
        // const error = new Error(errorType.ARGUMENT_IS_NOT_EMPTY);
        // ctx.app.emit('error', error, ctx);
        return;
      }

      // 根据登录code 获取 openid 与 session_key
      const { openid, session_key } = await getWXProof(ctx, code);
      if (!openid) {
        handleError(errorType.INTERNAL_PROBLEMS, '获取openid出现问题', ctx);
        // console.log('获取openid出现问题')
        // const err = new Error(errorType.INTERNAL_PROBLEMS);
        // ctx.app.emit('error', err, ctx);
        return;
      }

      // 解密用户信息
      const wxUserInfo = decryption(session_key, encryptedData, iv);
      if (!wxUserInfo) {
        handleError(errorType.INTERNAL_PROBLEMS, '解密用户信息出现问题', ctx);
        // console.log('解密用户信息出现问题');
        // const err = new Error(errorType.INTERNAL_PROBLEMS);
        // ctx.app.emit('error', err, ctx);
        return;
      }
      console.log('用户信息解密成功：', wxUserInfo);

      // 根据 openid 去数据库查询
      const result = await queryUser({openid});
      if (!result) {
        handleError(errorType.INTERNAL_PROBLEMS, '数据库查询用户信息出错', ctx);
        // console.log('数据库查询用户信息出错');
        // const err = new Error(errorType.INTERNAL_PROBLEMS);
        // ctx.app.emit('error', err, ctx);
        return;
      }
      console.log(result, '数据库中查询到的用户信息');

      if (result.length > 0 ) {
        // 已注册，判断这条数据中的 nickname 与 解密出的nickname是否一致
        if (result[0].nickname !== wxUserInfo.nickName) {
          handleError(errorType.ACCOUNT_NUMBER_AND_ID_DO_NOT_MATCH, 'openid 与 nickname不一致', ctx);
          return;
        }
        ctx.loginInfo = result[0];
      } else {
        // 未注册
        const params = {
          openid,
          avatarUrl: wxUserInfo.avatarUrl,
          nickname: wxUserInfo.nickName
        }
        const res = await register(params);
        if (!res) {
          handleError(errorType.INTERNAL_PROBLEMS, '数据库插入用户数据出错-注册', ctx);
          // console.log('数据库插入用户数据出错-注册');
          // const err = new Error(errorType.INTERNAL_PROBLEMS);
          // ctx.app.emit('error', err, ctx);
          return;
        }

        // 再次查询用户数据，并保存下来，用以登录
        const result = await queryUser({openid});
        if (!result) {
          handleError(errorType.INTERNAL_PROBLEMS, '数据库查询用户信息出错-注册', ctx);
          // console.log('数据库查询用户信息出错');
          // const err = new Error(errorType.INTERNAL_PROBLEMS);
          // ctx.app.emit('error', err, ctx);
          return;
        }

        ctx.loginInfo = result[0];
      }
    } else {
      console.log('账号登录')
      if ( !username || !password ) {
        const error = new Error(errorType.ARGUMENT_IS_NOT_EMPTY);
        ctx.app.emit('error', error, ctx);
        return;
      }
    }
    await next();
  }

  async queryUserForBind(ctx, next) {
    const { username, password } = ctx.request.body;
    const { userId } = ctx.request.body.user;
    if (!username || !password) {
      handleError(errorType.ARGUMENT_IS_NOT_EMPTY, '缺少参数-绑定', ctx);
      return;
    }

    // 查询当前 openid 是否已被绑定
    const res = await queryUser({userId});
    if (res.length && res[0].username) {
      handleError(errorType.THE_ACCOUNT_HAS_BEEN_BOUND, '账号已被绑定', ctx);
      return;
    }

    // 查询账号名称是否已存在
    const result = await queryUser({username});
    if (result.length) {
      handleError(errorType.NICKNAME_DUPLICATION, '昵称重复', ctx);
      return;
    }

    await next();
  }

}

module.exports = new AccountMiddleware();