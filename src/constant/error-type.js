const ARGUMENT_IS_NOT_EMPTY = 'argument_is_not_empty'; // 参数不为空
const THIRD_PARTY_INTERFACE_ERROR = 'third_party_interface_error'; // 第三方错误
const DECRYPTION_FAILURE = 'decryption_failure'; // 解密失败
const INTERNAL_PROBLEMS = 'Internal_problems'; // 内部出现问题
const ACCOUNT_NUMBER_AND_ID_DO_NOT_MATCH = 'account_number_and_id_do_not_match'; // 账号与id不匹配
const NO_PERMISSION = 'no_permission'; // 无权限
const UNAUTHORIZED = 'unauthorized'; // 未授权
const INVALID_PARAMETER = 'illegal_parameter'; // 非法参数
const ACCOUNT_ALREADY_EXISTS = 'account_already_exists'; // 账号已存在
const NICKNAME_DUPLICATION = 'nickname_duplication';
const THE_ACCOUNT_HAS_BEEN_BOUND = 'the_account_has_been_bound'; // 当前账号已被绑定
const USER_NOT_FOUND = 'user_not_found'; // 用户未找到
const ERROR_INCORRECT_USERNAME_OR_PASSWORD = 'error_incorrect_username_or_password'; // 用户名或密码错误
const USER_MISMATCH_ERROR = "user_mismatch_error"; // 当前登录用户与被修改用户不一致

module.exports = {
  ARGUMENT_IS_NOT_EMPTY,
  THIRD_PARTY_INTERFACE_ERROR,
  DECRYPTION_FAILURE,
  INTERNAL_PROBLEMS,
  ACCOUNT_NUMBER_AND_ID_DO_NOT_MATCH,
  NO_PERMISSION,
  UNAUTHORIZED,
  INVALID_PARAMETER,
  ACCOUNT_ALREADY_EXISTS,
  THE_ACCOUNT_HAS_BEEN_BOUND,
  NICKNAME_DUPLICATION,
  USER_NOT_FOUND,
  ERROR_INCORRECT_USERNAME_OR_PASSWORD,
  USER_MISMATCH_ERROR
};
