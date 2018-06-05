
// 公共变量
let fileUrl = 'http://test.paigekuaiyun.com/index/';
let loginInfo = wx.getStorageSync('loginInfo');
loginInfo = loginInfo.loginName
// let urls = 'http://www.paigekuaiyun.com/index/' //正式
let urls = 'http://test.paigekuaiyun.com/index/'  //测试
/*
 * post请求公共方法
 */

function callBack(res, successFull, msgFull) {
  switch (res.code) {
    case 0: successFull ? successFull(res) : null; //请求成功,返回result结果信息
      break;
    case 1:
      //登陆超时，自动跳转到登录页面
      wx.showToast({
        title: '登陆超时', //提示内容
        icon: 'success', //图标，只支持"success"、"loading"
        duration: 2000 //提示延迟时间，单位毫秒。默认1500，最大为10000
      }),
        //跳转到登录页面
        wx.navigateTo({
          url: '/pages/login/login'
        })
      break;
    case 2:
      //登陆超时，自动跳转到登录页面
      wx.showToast({
        title: '登陆超时', //提示内容
        icon: 'success', //图标，只支持"success"、"loading"
        duration: 2000 //提示延迟时间，单位毫秒。默认1500，最大为10000
      }),
        //跳转到登录页面
        wx.navigateTo({
          url: '/pages/login/login'
        })
      break;
    case 11:
      //用户尚未注册，自动跳转到绑定手机号页面
      wx.showToast({
        title: '用户尚未注册', //提示内容
        icon: 'success', //图标，只支持"success"、"loading"
        duration: 2000 //提示延迟时间，单位毫秒。默认1500，最大为10000
      }),
        //跳转到登录页面
        wx.navigateTo({
          url: '/pages/resiger/resiger'
        })
      break;
    case 1004:
      //用户已注册，自动跳转到绑定手机号页面
      wx.showToast({
        title: res.msg, //提示内容
        icon: 'none', //图标，只支持"success"、"loading"
        duration: 2000, //提示延迟时间，单位毫秒。默认1500，最大为10000
        success: function () {
          //跳转到登录页面
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }, 2000)
        }
      })
      break;
    case 1019:
      //用户无token，自动跳转到绑定手机号页面
      wx.showToast({
        title: res.msg, //提示内容
        icon: 'none', //图标，只支持"success"、"loading"
        duration: 2000, //提示延迟时间，单位毫秒。默认1500，最大为10000
        success: function () {
          //跳转到登录页面
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }, 2000)
        }
      })
      break;
    case 1022:
      //没有数据
      msgFull ? msgFull(res) : null
      break;
    default:
      wx.showToast({
        // title: res.errorCode,
        icon: 'none',
        title: res.msg,
      })
  }
}

const postNet = ({ requestType, method, param, successFull, err, errDataEmpty, errDataEnd, errDefault }) => {
  let url = urls + method + '?ajax=1'

  //公共参数 
  var loginInfo = wx.getStorageSync('loginInfo');
  // console.log(loginInfo);

  let { token, userId, loginName } = loginInfo;
  param.loginName = loginName;
  param.token = token;
  param.userId = userId;
  param.type = "1";

  param.userType = "4";

  wx.request({
    url: url,
    method: requestType,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
      "info": JSON.stringify(param)
    },
    success: (res) => {
      console.log(res);

      var res = res.data;
      callBack(res, successFull)
    },
    fail: err ? err : null
  })
}




/*
 * post请求公共方法未封装参数
 */
const postNetNoParam = ({ requestType, method, param, successFull, msgFull, err, pageNum }) => {
  let pageNumCon = pageNum ? pageNum : '';
  let url = urls + method + '?ajax=1' + pageNumCon;
  //公共参数 
  var loginInfo = wx.getStorageSync('loginInfo');
  param.token = loginInfo.token
  wx.request({
    url: url,
    method: 'POST',
    data: {
      "info": param
    },
    success: (res) => {
      var res = res.data;
      // console.log(res);
      callBack(res, successFull, msgFull)
    },
    fail: err ? err : null
  })
}
/*
 * post请求公共方法未封装参数 无密钥
 */
const postNetNoToken = ({ requestType, method, param, successFull, err }) => {
  let url = urls + method + '?ajax=1';
  // let url = null;
  // if (method.indexOf('http') < 0) {
  //   url = 'http://test.paigekuaiyun.com/index/' + method + '?ajax=1';
  // } else {
  //   url = method;
  // }
  // console.log(url, method.indexOf('http'))
  wx.request({
    url: url,
    method: 'POST',
    data: {
      "info": param
    },
    success: (res) => {
      var res = res.data;
      // console.log(res);
      callBack(res, successFull)
    },
    fail: err ? err : null
  })
}

/**
 * 改变提示图片（此图标为感叹号）
 */
const tastWarn = function tastWarn(content) {
  wx.showToast({
    title: content,
    image: '../../images/warn.png',
    mask: true,
    duration: 2000
  });
}

const tastWarn1 = function tastWarn(content) {
  wx.showToast({
    title: content,
    image: '../../../../images/warn.png',
    mask: true,
    duration: 2000
  });
}



/*
 * 计算分页方法
 */
const currentPage = ({ s_i, count }) => {
  if (s_i > 0) {
    s_i = s_i * count + 1;
  }
  return s_i;
}

// 处理数字保留2位小数
function changeTwoDecimal_f(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    return 0;
  }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

const regexPCA = (address) => {
  // console.log(address)
  var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;

  var REGION_PROVINCE = [];
  var addressBean = {
    REGION_PROVINCE: null,
    REGION_COUNTRY: null,
    REGION_CITY: null,
    ADDRESS: null
  };
  function regexAddressBean(address, addressBean) {

    if (address.indexOf("(") == -1) {

      splitStr()

    } else {
      // 说明用户点击的是默认地址 ============================================================================
      // 截取市
      addressBean.REGION_CITY = address.split('(')[1];


      if (address.split('(')[1].indexOf("省") != -1 || address.split('(')[1].indexOf("市") != -1) {

        console.log('默认');
        if (addressBean.REGION_CITY.indexOf('省') != -1) {
          addressBean.REGION_PROVINCE = addressBean.REGION_CITY.split('省')[0] + '省'
          // addressBean.REGION_COUNTRY = address.split('省')[1].split('市')[0] + '市';
          addressBean.REGION_CITY = address.split('省')[1].split('市')[0] + '市';


        } else {

          addressBean.REGION_PROVINCE = addressBean.REGION_CITY.split('市')[0] + '市'
          addressBean.REGION_CITY = addressBean.REGION_CITY.split('市')[0] + '市';
          // 截取区
          addressBean.REGION_COUNTRY = address.split('(')[1].split(')')[0].split('市')[1];
          console.log(addressBean.REGION_CITY)
          console.log(addressBean.REGION_COUNTRY)
        }
        // 详细地址
        addressBean.ADDRESS = address.split('(')[0];

      } else {
        splitStr()
      }
    }
  }

  function splitStr() {
    if (address.indexOf("特别行政区") == -1) {
      // 说明地址不是特别行政区，接着监测输入地址是省范围还是市范围
      //  截取省或者市
      if (address.indexOf("省") != -1) {
        // 用户输入地址是省范围
        // 1-  截取省市

        addressBean.REGION_CITY = address.split('市')[0] + '市';
        if (addressBean.REGION_CITY.indexOf('省') != -1) {
          addressBean.REGION_CITY = addressBean.REGION_CITY.split('省')[1];
        } else {
          addressBean.REGION_CITY = addressBean.REGION_CITY;
        };
        //  2- 截取市区县  首先将省市截取出来
        // addressBean.ADDRESS = address.substring(address.indexOf('区'|) + 1);
        var num1 = address.substring(address.indexOf('市') + 1);
        // console.log(num1)
        if (num1.indexOf('区') != -1) {

          addressBean.REGION_COUNTRY = num1.split('区')[0] + '区';
          addressBean.ADDRESS = num1.split('区')[1];
        }
        else if (num1.indexOf('县') != -1) {

          addressBean.REGION_COUNTRY = num1.split('县')[0] + '县';
          addressBean.ADDRESS = num1.split('县')[1];

        } else if (num1.indexOf('市') != -1) {
          // 截取市
          addressBean.REGION_COUNTRY = num1.split('市')[0] + '市';
          addressBean.ADDRESS = num1.split('市')[1];

        }
        // console.log(addressBean.REGION_COUNTRY);
        // console.log(addressBean.ADDRESS);

      } else {
        addressBean.REGION_CITY = address.split('市')[0] + '市';
        // 市区范围
        addressBean.REGION_COUNTRY = address.split('区')[0].split('市')[1] + '区';
        // console.log(addressBean.REGION_COUNTRY);
        // 截取到详细地址
        addressBean.ADDRESS = address.substring(address.indexOf('区') + 1);
        // console.log(addressBean.ADDRESS)
      }
    } else {
      // 特别行政区==========================================================================================

      addressBean.REGION_CITY = address.split('特别行政区')[0] + '特别行政区';
      // 市区范围
      addressBean.REGION_COUNTRY = address.substring(address.indexOf('区') + 1);
      addressBean.REGION_COUNTRY = addressBean.REGION_COUNTRY.split('区')[0] + '区';
      // console.log(addressBean.REGION_COUNTRY);
      if (!addressBean.REGION_COUNTRY) {
        addressBean.REGION_COUNTRY = '';
      }
      // 截取到详细地址
      var add = address.substring(address.indexOf('区') + 1)
      addressBean.ADDRESS = add.substring(address.indexOf('区') + 1);
      // console.log(addressBean)
    }
  }

  if (!(REGION_PROVINCE = regex.exec(address))) {
    regex = /^(.*?(省|自治区|市))(.*?)$/;
    REGION_PROVINCE = regex.exec(address);
    console.log(addressBean)
    if (REGION_PROVINCE == '' || REGION_PROVINCE == null || REGION_PROVINCE == undefined) {
      wx.showToast({
        title: '目的地不能为空',
        duration: 0,
        icon: 'none',
      })
      return false;
    }
    addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
    // regexAddressBean(REGION_PROVINCE[3], addressBean
    regexAddressBean(address, addressBean);
  } else {
    console.log(address);
    if (address.indexOf("(") == -1) {

      addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
      // console.log(addressBean.REGION_PROVINCE)
      regexAddressBean(address, addressBean);

    } else {

      if (address.split('(')[1].indexOf("省") == -1 || address.split('(')[1].indexOf("市") == -1) {

        addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
        regexAddressBean(address, addressBean);
        // console.log('走了');

      } else {

        // addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
        // console.log(addressBean.REGION_PROVINCE)
        regexAddressBean(address, addressBean);
      }

    }

  }
  // console.log(addressBean)
  return addressBean;
}

module.exports = {
  postNet,
  tastWarn: tastWarn,
  tastWarn1: tastWarn1,
  postNetNoParam,
  postNetNoToken,
  currentPage,
  fileUrl,
  loginInfo,
  regexPCA,
  changeTwoDecimal_f
}
