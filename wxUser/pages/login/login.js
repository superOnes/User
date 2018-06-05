// pages/login/login.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginname: '',
    password: ''
  },
  loginname: function(res){
    this.setData({
      loginname: res.detail.value
    })
  },
  password: function(res){
    this.setData({
      password: res.detail.value
    })
  },
  login: function(){
    if (this.data.loginname.length < 1) {
      wx.showToast({
        title: '请填写手机号！',
        icon: 'none',
        mask: true
      })
    } else if (this.data.password.length < 1){
      wx.showToast({
        title: '请填写密码！',
        icon: 'none',
        mask: true
      })
    } else {
      let openid = wx.getStorageSync('openId')
      app.postNetNoToken({
        requestType: 'POST',
        method: 'login/loginCheck',
        param: {
          openid: openid,
          loginname: this.data.loginname,
          password: this.data.password
        },
        successFull: (res) => {
          wx.showLoading({
            title: '登录中...',
            success: () => {
              wx.setStorage({
                key: 'loginInfo',
                data: res.result,
                success: (res) => {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              })
            }
          })
        },
        err: (res) => {
          wx.showToast({
            title: '请检查网络',
            icon: 'none',
            mask: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})