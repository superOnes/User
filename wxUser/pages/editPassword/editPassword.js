// pages/editPassword/editPassword.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  formSubmit: function (formData) {
    let pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/;
    formData = formData.detail.value
    for (let every in formData){
      if (formData[every] == ''){
        wx.showToast({
          title: '请完善您的密码信息',
          icon: 'none',
          mask: true
        })
        return false
      }
    }
    if (pattern.test(formData.newpsd)){
      if(formData.newpsd == formData.newpsd1) {
        app.postNetNoParam({
          requestType: 'POST',
          method: 'user/editpsd',
          param: {
            oldpsd: formData.oldpsd,
            newpsd: formData.newpsd
          },
          successFull: (res) => {
            wx.showToast({
              title: '密码修改成功！',
              mask: true,
              success: (res) => {
                wx.navigateBack()
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
      } else {
        wx.showToast({
          title: '新密码需要保持一致',
          icon: 'none',
          mask: true
        })
      }
    } else {
      wx.showToast({
        title: '请输入6-10的字母、数字结合',
        icon: 'none',
        mask: true
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