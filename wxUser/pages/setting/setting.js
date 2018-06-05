// pages/setting/setting.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInvitation: true,
    invitationCode: ''
  },

  quit: function () {
    wx.showModal({
      title: '提示',
      content: '确认退出吗？',
      success: (res) => {
        if(res.confirm) {
          app.postNetNoParam({
            requestType: 'POST',
            method: 'login/loginOut',
            param: {},
            successFull: (res) => {
              wx.reLaunch({
                url: '/pages/login/login',
                success: (res) => {
                  wx.clearStorage()
                }
              })
            },
            err: (res) => {
              wx.showToast({
                title: '退出失败，请检查网络！',
                icon: 'none',
                mask: true
              })
            }
          })
        }
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
    let that = this;
    let invitationCode = wx.getStorageSync('invitationCode');
    let invite_code = wx.getStorageSync('loginInfo').invite_code;
    if (invitationCode){
      this.setData({
        invitationCode: invitationCode,
        isInvitation: false
      })
    } else if (invite_code){
      this.setData({
        invitationCode: invite_code,
        isInvitation: false
      })
    } else {
      this.setData({
        isInvitation: true
      })
    }
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