// pages/booklistselect/booklistselect.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: false,
    addressListArr: [],
    isSelectThis: false,
    showNew: true
  },
  radioChange: function (e) {
    // console.log(e)
    app.postNetNoParam({
      requestType: 'POST',
      method: 'user/useraddress_isdefault',
      param: {
        id: e.currentTarget.dataset.id
      },
      successFull: (res) => {
        wx.showToast({
          title: '设置成功',
          mask: true
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

  // 编辑当前地址
  editAddress: function (e) {
    let addressId = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/addressbook/addressbook?a=start&addressId=' + addressId,
    })
  },
  // 删除当前地址
  deleteAddress: function (e) {
    let addressId = e.target.dataset.id;
    let that = this;
    wx.showModal({
      title: '删除操作',
      content: '确定删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          app.postNetNoParam({
            requestType: 'POST',
            method: 'user/useraddress_del',
            param: {
              id: addressId
            },
            successFull: (res) => {
              wx.showToast({
                title: '删除成功',
                success: (res) => {
                  that.onShow()
                }
              })
            },
            err: (res) => {
              wx.showToast({
                title: '请检查网络',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  selectThis: function (e) {
    let items = e.currentTarget.dataset.item
    items.province_str = items.province_str ? items.province_str : items.city_str
    if (this.data.isSelectThis == 'start') {
      wx.setStorage({
        key: 'start',
        data: items
      })
      wx.removeStorage({ key: 'consignor' })
      wx.navigateBack()
    } else if (this.data.isSelectThis == 'end') {
      wx.setStorage({
        key: 'end',
        data: items
      })
      wx.removeStorage({ key: 'consignee' })
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    if (options.a) {
      this.setData({
        isSelectThis: options.a
      })
    } else {
      this.setData({
        isSelectThis: false,
        showNew: false
      })
    }
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
    wx.getStorage({
      key: 'loginInfo',
      success: function (res) {
        app.postNetNoParam({
          requestType: 'POST',
          method: 'user/useraddress_list',
          param: {},
          successFull: (res) => {
            let addressList = res.result.data;
            // console.log(addressList)
            that.setData({
              addressListArr: addressList,
              isEmpty: true
            })
          },
          msgFull: function(){
            that.setData({
              isEmpty: false
            })
          },
          err: (res) => {
            wx.showLoading({
              title: '网络出现错误！'
            })
          }
        })
      }
    })
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