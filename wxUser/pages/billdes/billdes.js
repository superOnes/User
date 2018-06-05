// pages/billdes/billdes.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoice: null,
    order: null,
  },
  getDetail: function(orderId){
    app.postNetNoParam({
      requestType: 'POST',
      method: 'invoice/invoice_details',
      param: {
        id: orderId
      },
      successFull: (res) => {
        let expressCon = ''
        switch (res.result.invoice.express_type){
          case '0':
            expressCon = '未选择'
            break
          case '1':
            expressCon = '圆通'
            break
          case '2':
            expressCon = '申通'
            break
          case '3':
            expressCon = 'EMS'
            break
          case '4':
            expressCon = '韵达'
            break
          case '5':
            expressCon = '中通'
            break
          case '6':
            expressCon = '顺丰'
            break
        }
        this.setData({
          invoice: res.result.invoice,
          order: res.result.order,
          orderLength: res.result.order.length,
          expressCon: expressCon
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
    this.getDetail(options.id)
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