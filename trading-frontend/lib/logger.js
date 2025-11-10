/**
 * 交易日志记录模块
 */

// 日志级别
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// 当前日志级别
const CURRENT_LOG_LEVEL = LOG_LEVELS.INFO;

// 日志存储数组
let logs = [];

/**
 * 记录日志
 * @param {string} level 日志级别
 * @param {string} message 日志消息
 * @param {Object} data 附加数据
 */
function log(level, message, data = {}) {
  // 检查日志级别
  if (LOG_LEVELS[level] > CURRENT_LOG_LEVEL) {
    return;
  }

  // 创建日志条目
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  };

  // 添加到日志数组
  logs.push(logEntry);

  // 限制日志数量
  if (logs.length > 1000) {
    logs = logs.slice(-500);
  }

  // 在控制台输出
  console.log(`[${level}] ${message}`, data);

  // 在生产环境中，可以将日志发送到服务器
  // sendLogToServer(logEntry);
}

/**
 * 记录错误日志
 * @param {string} message 错误消息
 * @param {Object} error 错误对象
 */
export function logError(message, error = {}) {
  log('ERROR', message, { error: error.message || error, stack: error.stack || '' });
}

/**
 * 记录警告日志
 * @param {string} message 警告消息
 * @param {Object} data 附加数据
 */
export function logWarning(message, data = {}) {
  log('WARN', message, data);
}

/**
 * 记录信息日志
 * @param {string} message 信息消息
 * @param {Object} data 附加数据
 */
export function logInfo(message, data = {}) {
  log('INFO', message, data);
}

/**
 * 记录调试日志
 * @param {string} message 调试消息
 * @param {Object} data 附加数据
 */
export function logDebug(message, data = {}) {
  log('DEBUG', message, data);
}

/**
 * 记录AI相关日志
 * @param {string} action AI动作
 * @param {Object} data 附加数据
 */
export function logAI(action, data = {}) {
  logInfo(`AI-${action}`, data);
}

/**
 * 获取所有日志
 * @returns {Array} 日志数组
 */
export function getLogs() {
  return [...logs];
}

/**
 * 清空日志
 */
export function clearLogs() {
  logs = [];
}

/**
 * 记录交易相关日志
 * @param {string} action 交易动作
 * @param {Object} order 订单信息
 * @param {Object} result 交易结果
 */
export function logTrade(action, order, result) {
  logInfo(`交易-${action}`, {
    orderId: order.id || order.timestamp,
    stockCode: order.stockCode,
    price: order.price,
    quantity: order.quantity,
    type: order.type,
    orderType: order.orderType,
    result: result.success ? '成功' : '失败',
    message: result.message || '',
    timestamp: result.timestamp
  });
}

/**
 * 记录账户相关日志
 * @param {string} action 账户动作
 * @param {Object} account 账户信息
 * @param {Object} data 附加数据
 */
export function logAccount(action, account, data = {}) {
  logInfo(`账户-${action}`, {
    accountId: account.id,
    balance: account.balance,
    ...data
  });
}

export default {
  logError,
  logWarning,
  logInfo,
  logDebug,
  logAI,
  logTrade,
  logAccount,
  getLogs,
  clearLogs
};