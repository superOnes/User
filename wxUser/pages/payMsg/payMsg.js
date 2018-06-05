// pages/payMsg/payMsg.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    firstPay: '',
    coupon_money: '',
    lastPay: '',
    fulldelivery: '0.00',
    fulldeliveryId: '',
    order_id: ''
  },
  // 手动改变价格
  lastPayChange: function(e){
    this.setData({
      lastPay: e.detail.value
    })
  },
  // 触发满减列表
  fulldelivery: function(){
    let money = parseInt(this.data.firstPay*100) - parseInt(this.data.coupon_money*100) - parseInt(this.data.detail.actual_money);
    money = money < 0 ? 0 : money
    app.postNetNoParam({
      requestType: 'POST',
      method: 'order/fulldelivery',
      param: {
        money: money
      },
      successFull: (res) => {
        let datas = res.result;
        let firstPay = this.data.firstPay
        let actual_money = this.data.actual_money
        let lastPay = parseInt(firstPay * 100) - parseInt(this.data.coupon_money * 100) - parseInt(datas.delivery) - parseInt(actual_money*100);
        if(datas.data){
          this.setData({
            fulldeliveryId: datas.id,
            fulldelivery: '0.00',
            lastPay: lastPay <= 0 ? '0.00' : app.changeTwoDecimal_f(lastPay/100)
          })
        } else{
          this.setData({
            fulldeliveryId: datas.id,
            lastPay: lastPay <= 0 ? '0.00' : app.changeTwoDecimal_f(lastPay/100),
            fulldelivery: app.changeTwoDecimal_f(datas.delivery/100)
          })
        }
      },
      err: (res) => {
        app.errTip()
      }
    })
  },
  goPay: function() {
    console.log(app.couponId)
    let that = this;
    let userMsg = wx.getStorageSync('loginInfo')
    app.postNetNoParam({
      requestType: 'POST',
      method: 'Wxpay/weixin',
      param: {
        user_id: userMsg.user_id,
        userType: "1",
        merOrderNum: this.data.detail.order_code,
        tranAmt: this.data.lastPay,
        merRemark1: "",
        trade_type: "JSAPI",
        pay_type: "5"
      },
      successFull: (res) => {
        let result = res.result
        // 调用小程序支付
        wx.requestPayment({
          'appId': result.appId,
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': result.package,
          'signType': 'MD5',
          'paySign': result.paySign,
          'success': function (res) {
            app.postNetNoParam({
              requestType: 'POST',
              method: 'order/couponrecord',
              param: {
                order_id: that.data.order_id,
                coupon_id: app.couponId,
                full_delivery_id: that.data.fulldeliveryId
              },
              successFull: (res) => {
                wx.navigateBack()
                wx.removeStorageSync('money')
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
          'fail': function (res) {
            wx.showToast({
              title: '您取消了支付',
              icon: 'none',
              mask: true
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

  // 获取运单支付信息
  getPayMsg: function(key){
    let that = this
    app.postNetNoParam({
      requestType: 'POST',
      method: 'order/order_list',
      param: {
        status: '0',
        keyword: key
      },
      successFull: (res) => {
        let dataS = res.result.data;
        let money = wx.getStorageSync('money')
        let lastPay = parseInt(dataS[0].deal_price) / 100 - parseInt(dataS[0].coupon_money) - parseInt(dataS[0].full_delivery_money) - parseInt(dataS[0].actual_money) / 100;
        if (money) {
          this.setData({
            coupon_money: dataS[0].coupon_money == '0.00' ? app.changeTwoDecimal_f(money) : dataS[0].coupon_money
          })
        } else{
          this.setData({
            coupon_money: '0.00'
          })
        }
        let lastPay1 = lastPay - that.data.coupon_money
        lastPay1 = lastPay1 < 0 ? '0.00' : lastPay1
        this.setData({
          order_id: dataS[0].id,
          firstPay: app.changeTwoDecimal_f(dataS[0].deal_price/100),
          detail: dataS[0],
          lastPay: that.data.coupon_money == '0.00' ? app.changeTwoDecimal_f(lastPay) : app.changeTwoDecimal_f(lastPay1),
          fulldelivery: dataS[0].full_delivery_money ? app.changeTwoDecimal_f(dataS[0].full_delivery_money) : '0.00',
          actual_money: app.changeTwoDecimal_f(dataS[0].actual_money/100)
        })
        this.fulldelivery()
      },
      err: (res) => {
        app.errTip()
      },
      pageNum: '&page=1'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderCode: options.orderCode
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
    this.getPayMsg(this.data.orderCode)
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