//app.js
var net = require('utils/netutils.js');
var loginInfo = wx.getStorageSync('loginInfo');

App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
      if (res.hasUpdate){
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })


    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: '下载失败，请检查网络'
      })
      // 新的版本下载失败
    })
    
    let loginInfo = wx.getStorageSync('loginInfo')
    // console.log(loginInfo)
    if (loginInfo.length < 1) {
      wx.showModal({
        title: '提示',
        content: '您没有登录，请登录！',
        showCancel: false,
        success: (res) => {
          if(res.confirm){
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        }
      })
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        net.postNetNoToken({
          requestType: 'POST',
          method: 'login/getxcxinfo',
          param: {
            code: res.code
          },
          successFull: (res) => {
            // console.log(res.result.openid)
            wx.setStorage({
              key: 'openId',
              data: res.result.openid
            })
          },
          err: (res) => {
            wx.showToast({
              title: '请检查网络！',
              icon: 'none',
              mask: true
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  },
  account: null,
  setCargoInfo: null,   
  postNet: net.postNet,                       //请求方式
  postNetNoParam: net.postNetNoParam,        //请求方式
  postNetNoToken: net.postNetNoToken,       //请求方式
  fileUrl : net.fileUrl,            //接口路径
  tastWarn : net.tastWarn,          //警告提示
  regexPCA : net.regexPCA,          //城市验证
  changeTwoDecimal_f: net.changeTwoDecimal_f,         // 处理数字保留2位小数
  couponId: null,                 //优惠卷Id
  errTip: (res) => {
    wx.showToast({
      title: '请检查网络！',
      icon: 'none',
      mask: true
    })
  }
})