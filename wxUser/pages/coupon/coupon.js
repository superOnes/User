// pages/coupon/coupon.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Valid: false,
    NotValid: true,
    isEmpty: false,    
    items: [],         //优惠券列表数组
    itemsUsed: [],    //已使用优惠券数组
    pageNum: 1,      //页码 
    status: 1       //使用未使用
  },
  // tab切换
  tabToggle: function () {
    // this.getSchedule(this.data.orderNum)
    this.setData({
      Valid: false,
      NotValid: true,
      status: 1
    })
    this.getCoupon()
  },
  tabToggle1: function () {
    this.setData({
      Valid: true,
      NotValid: false,
      status: 2
    })
    this.getCoupon()
  },
  formSubmit: function(formValue){
    let money = formValue.detail.value.money
    if (money){
      // let discountId = formValue.detail.value.discountId
      wx.setStorage({
        key: 'money',
        data: money,
        success: (res) => {
          wx.navigateBack()
        }
      })
    }
  },
  // 选择优惠券
  couponTap: function(e){
    app.couponId = e.currentTarget.dataset.id
  },
  // 获取优惠券
  getCoupon: function(){
    app.postNetNoParam({
      method: 'order/couponlog',
      requestType: 'POST',
      param: {
        status: this.data.status
      },
      pageNum: '&page=' + this.data.pageNum,
      successFull: (res) => {
        let datas = res.result.data;
        if (this.data.status == 2){
          this.setData({
            itemsUsed: datas,
            isEmpty: true
          })
        } else {
          this.setData({
            isEmpty: true,
            items: datas
          })
        }
      },
      //没有数据
      msgFull: (res) => {
        this.setData({
          isEmpty: false
        })
      },
      err: (res) =>{
        app.errTip()
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoupon()
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