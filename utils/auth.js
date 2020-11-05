/**
 * 静默授权[auth_base] -> 用来判断是否是第一次登录
 * 主动授权['auth_user', 'auth_industry'] -> 用来授权，以及获取用户信息
*/

/**
 * jsapi无响应检测
 * */
function loopCheckTimeout() {
  let count = 0;
  let timer = null;
  return function (reject) {
    timer = setInterval(() => {
      if (count === 5) {
        clearInterval(timer);
        count = 0;
        reject('timeout');
      }
      count++;
    }, 1000);
  };
}

/**
 * 主动授权获取用户头像和昵称
 * */
export function getAuthUserInfo() {
  return new Promise((resolve, reject) => {
    try {
      my.getAuthCode({
        scopes: ['auth_user'],
        success: (res) => {
          my.getAuthUserInfo({
            success: (userInfo) => {
              resolve(userInfo);
            },
            fail: (err) => {
              return reject(err);
            }
          });
        },
        fail: (res) => {
          return reject(res);
          // my.alert({
          //     title: '授权失败，请稍后再试',
          //     complete: () => reject(res)
          // })
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 静默授权
 * */
export function silenceAuthCode() {
  return new Promise((resolve, reject) => {
    loopCheckTimeout()(reject);
    try {
      my.getAuthCode({
        scopes: 'auth_base',
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          my.alert({
            title: '授权失败，请稍后再试',
            complete: () => reject(res)
          });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
