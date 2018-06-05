// pages/payPsd/payPsd.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgType: '获取验证码',
    msgTypeIs: false
  },
  // 忘记密码切换
  forgetPassword: function(){
    this.setData({
      ispaypsd: true
    })
  },
  // 获取验证码
  getCode: function(){
    let that = this;
    app.postNetNoParam({
      requestType: 'POST',
      method: 'login/getcode',
      param:  {
        mobile: this.data.name
      },
      successFull: (res) => {
        wx.showToast({
          title: '发送成功',
          mask: true,
          success: (res) => {
            that.setData({
              msgTypeIs: true,
              msgType: '30秒后重试'
            });
            setTimeout(function(){
              that.setData({
                msgTypeIs: false,
                msgType: '获取验证码'
              });
            },30000)
          }
        })
      },
      err: (res) => {
        wx.showToast({
          title: '发送失败',
          icon: 'none',
          mask: true
        })
      }
    })
  },
  // 设置支付密码
  formSubmit: function(options) {
    let formData = options.detail.value
    if (formData.checkcode.length < 1) {
      wx.showToast({
        title: '请填写验证码！',
        icon: 'none',
        mask: true
      })
    } else if (formData.password.length < 1) {
      wx.showToast({
        title: '请填写支付密码！',
        icon: 'none',
        mask: true
      })
    } else {
      app.postNetNoParam({
        requestType: 'POST',
        method: 'pay/up_pay',
        param: formData,
        successFull: (res) => {
          wx.showToast({
            title: '设置成功',
            mask: true,
            success: (res) => {
              wx.navigateBack()
            }
          })
        },
        err: (res) => {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            mask: true
          })
        }
      })
    }
  },
  // 修改支付密码
  formSubmit1: function(options) {
    let formData = options.detail.value
    if (formData.oldpsd.length < 1) {
      wx.showToast({
        title: '请填写原支付密码！',
        icon: 'none',
        mask: true
      })
    } else if (formData.newpass.length < 1 || formData.qrnewpass.length < 1) {
      wx.showToast({
        title: '请填写新支付密码！',
        icon: 'none',
        mask: true
      })
    } else {
      app.postNetNoParam({
        requestType: 'POST',
        method: 'pay/query_pay',
        param: formData,
        successFull: (res) => {
          wx.showToast({
            title: '修改成功',
            mask: true,
            success: (res) => {
              wx.navigateBack()
            }
          })
        },
        err: (res) => {
          wx.showToast({
            title: '修改失败',
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
    let that = this;
    wx.getStorage({
      key: 'loginInfo',
      success: function (res) {
        if (res.data.loginname) {
          that.setData({
            name: res.data.loginname
          })
        }
      }
    });
    app.postNetNoParam({
      requestType: 'POST',
      method: 'Pay/query_password',
      param: {},
      successFull: (res) => {
        that.setData({
          ispaypsd: res.result.ispaypw == 2 ? false : true
        })
      },
      err: (res) =>{
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
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