// pages/getbillinfo/getbillinfo.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    province_code: '',
    city_code: '',
    area_code: '',
    order_id: '',
    money: ''
  },
  // 选择收件地址
  chooseLocation: function(){
    let that = this
    wx.chooseLocation({
      success: (res) => {
        let newAddress = app.regexPCA(res.address)
        app.postNetNoToken({
          requestType: 'POST',
          method: 'index/change_citycode',
          param: {
            province_str: newAddress.REGION_PROVINCE,
            city_str: newAddress.REGION_CITY,
            area_str: newAddress.REGION_COUNTRY
          },
          successFull: function (e) {
            let codes = e.result;
            that.setData({
              province_code: codes[0].province_code,
              city_code: codes[1].city_code,
              area_code: codes[2].area_code,
              address: res.address,
              start_full_address: res.name
            })
          },
          err: (res) => {
            app.errTip()
          }
        })
      },
      fail: (res) =>{
        app.errTip()
      }
    })
  },

  formSubmit: function(e){
    let formValue = e.detail.value;
    for(let every in formValue){
      if (!formValue[every]){
        wx.showToast({
          title: '请完善您的信息！',
          icon: 'none',
          mask: true
        })
        return false
      }
    }
    formValue.order_id = this.data.order_id
    formValue.money = this.data.money
    app.postNetNoParam({
      requestType: 'POST',
      method: 'invoice/invoice_add',
      param: formValue,
      successFull: function (e) {
        wx.navigateBack()
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
    // console.log(options)
    this.setData({
      monry: options.acount,
      order_id: options.ids
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