// pages/wallet/wallet.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payValue: '0.00',
    hiddenmodalput: true,
    goPayValue: ''
  },
  goPayValue: function(e){
    this.setData({
      goPayValue: e.detail.value
    })
  },
  payBtn: function() {
    this.setData({
      hiddenmodalput: false
    })
  },
  confirm: function() {
    let that = this
    let userMsg = wx.getStorageSync('loginInfo')
    app.postNetNoParam({
        requestType: 'POST',
        method: 'Wxpay/weixin',
        param: {
          user_id: userMsg.user_id,
          userType: "1",
          merOrderNum: 'jssj179988712',
          tranAmt: that.data.goPayValue,
          merRemark1: "num",
          trade_type: "JSAPI",
          pay_type: "5"
        },
      successFull: (res) => {
        let result = res.result
        console.log(result)
        // 需要微信支付
        wx.requestPayment({
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': result.package,
          'signType': 'MD5',
          'paySign': result.paySign,
          'success': function (res) {
            console.log(res)
          },
          'fail': function (res) {
            console.log(res)
            wx.showToast({
              title: '您取消了支付',
              icon: 'none',
              mask: true,
              success: (res) => {
                that.setData({
                  hiddenmodalput: true,
                  goPayValue: ''
                })
              }
            })
          }
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
  },
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.openid)
    app.postNetNoParam({
      requestType: 'POST',
      method: 'user/account',
      param:{},
      successFull: (res) => {
        app.globalData.account = res.result;
        this.setData({
          payValue: res.result.balance ? res.result.balance : '0.00'
        })
        // console.log(app.account, res.result.balance)
      },
      err: (res) => {
        wx.showToast({
          title: '请检查网络！',
          icon: 'none',
          mask: true
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