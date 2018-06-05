// pages/isInvitation/isInvitation.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  formsubmit: function(e){
    let formData = e.detail.value
    if (!formData.invitecode) {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none'
      })
      return false
    }
    app.postNetNoParam({
      requestType: 'POST',
      method: 'user/addinvitecode',
      param: formData,
      successFull: (res) => {
        wx.showToast({
          title: '设置成功',
          mask: true,
          duration: 2000,
          success: (res) => {
            wx.setStorage({
              key: 'invitationCode',
              data: formData.invitecode
            })
            setTimeout(function(){
              wx.navigateBack()
            },2000)
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