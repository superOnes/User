// pages/orderMsg/orderMsg.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    listOrDetail: false,
    listOrDetail1: true,
    orderNum: null,
    detail: null,
    payCon: ''
  },
  tabToggle: function(){
    // this.getSchedule(this.data.orderNum)
    this.setData({
      listOrDetail: false,
      listOrDetail1: true
    })
  },
  tabToggle1: function(){
    this.setData({
      listOrDetail: true,
      listOrDetail1: false
    })
  },
  goMap: function(){
    wx.navigateTo({
      url: '/pages/map/map?orderCode=' + this.data.orderNum
    })
  },
  callPhone: function(){
    wx.makePhoneCall({
      phoneNumber: '4000605656',
      success: function (res) { },
      fail: function (res) { }
    })
  },

  // 获取订单详情
  getDetail: function(e){
    app.postNetNoParam({
      requestType: 'POST',
      method: 'order/order_show',
      param: {
        order_code: e
      },
      successFull: (res) => {
        this.setData({
          detail: res.result
        })
        // console.log(res.result)
        switch (this.data.detail.pay_type){
          case "1":
            this.setData({
              payCon: "在线支付"
            })
            break
          case "2":
            this.setData({
              payCon: "现金"
            })
            break
          case "3":
            this.setData({
              payCon: "到付"
            })
            break
          case "4":
            this.setData({
              payCon: "回单付"
            })
            break
          case "5":
            this.setData({
              payCon: "预付"
            })
            break
          case "6":
            this.setData({
              payCon: "月付"
            })
            break
        }
      },
      err: (res) => {
        app.errTip()
      }
    })
  },
  
  // 获取订单进度
  getSchedule: function(e){
    app.postNetNoToken({
      requestType: 'POST',
      method: 'order/order_select',
      param: {
        order_code: e
      },
      successFull: (res) => {
        // console.log(res.result)
        this.setData({
          orderList: res.result
        })
      },
      err: (res) => {
        app.errTip()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.code = 'SJBJ171222134613'
    this.getSchedule(options.code)
    this.getDetail(options.code)
    this.setData({
      orderNum: options.code
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