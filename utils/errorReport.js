// utils/errorReport.js
// 通用异常自动上报工具
export default function errorReport(err, info = '', page = '') {
  try {
    const payload = {
      message: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack : '',
      info,
      page,
      time: new Date().toISOString(),
      ua: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };
    uni.request({
      url: 'https://api.fanovian.cc:3000/api/log/error',
      method: 'POST',
      data: payload,
      header: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    // 上报失败可忽略
  }
}
