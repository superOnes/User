// pages/searchOrder/searchOrder.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sreachKey: '',
    orderList: [],
    handleCon: '取消订单',
    hiddenmodalput: true,
    isEmpty: true,
    pageNum: 1,
    remarks: '',
    modalId: ''
  },
  // 取消原因输入
  remarksChange: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  bindscrolltolower: function (e) {
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.orderList(this.data.sreachKey)
  },
  // 取消原因显示
  handleCon: function (e) {
    let orderId = e.currentTarget.dataset.orderid
    this.setData({
      modalId: orderId,
      hiddenmodalput: false
    })
  },
  // model取消
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
      remarks: ''
    })
  },
  // model确认
  confirm: function (e) {
    if (this.data.remarks){
      this.setData({
        hiddenmodalput: true
      })
      app.postNetNoParam({
        requestType: 'POST',
        method: 'order/usercancel',
        param: {
          order_id: JSON.stringify(this.data.modalId),
          cancel_remark: this.data.remarks
        },
        successFull: (res) => {
          this.orderList(this.data.sreachKey)
        },
        err: (res) => {
          app.errTip()
        }
      })
    }
  },
  goPayMsg: function(e){
    wx.navigateTo({
      url: '/pages/payMsg/payMsg?orderCode=' + e.currentTarget.dataset.ordercode,
    })
  },

  // 删除运单
  deleteOrder: function(e){
    let that = this;
    let orderId = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '确认提示',
      content: '确认删除该运单吗？',
      success: function (res) {
        if (res.confirm) {
          app.postNetNoParam({
            requestType: 'POST',
            method: 'order/userdel',
            param: {
              order_id: orderId
            },
            successFull: (res) => {
              that.setData({
                orderList: [],
                pageNum: 1
              })
              that.orderList(that.data.sreachKey)
            },
            err: (res) => {
              app.errTip()
            }
          })
        }
      }
    })
  },
  // 详情跳转
  detailTap: function (e) {
    wx.navigateTo({
      url: '/pages/orderMsg/orderMsg?code=' + e.currentTarget.dataset.code
    })
  },
  // 搜索运单号
  bindInput: function (e) {
    this.setData({
      sreachKey: e.detail.value
    })
    this.orderList(e.detail.value)
  },
  // 获取运单列表
  orderList: function (key) {
    if(key){
      this.setData({
        pageNum: 1
      })
    }
    let that = this;
    app.postNetNoParam({
      requestType: 'POST',
      method: 'order/order_list',
      param: {
        status: '0',
        keyword: key
      },
      successFull: (res) => {
        let dataS = res.result.data;
        if (this.data.pageNum == 1) {
          that.setData({
            orderList: dataS,
            isEmpty: true
          })
        } else {
          let orderListArr = this.data.orderList;
          for (let i = 0; i < dataS.length; i++) {
            orderListArr.push(dataS[i])
          }
          // console.log(orderListArr)
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            success: (res) => {
              setTimeout(function () {
                that.setData({
                  orderList: orderListArr,
                  isEmpty: true
                })
              }, 1000)
            }
          })
        }
      },
      msgFull: (res) => {
        this.setData({
          isEmpty: false
        })
      },
      err: (res) => {
        app.errTip()
      },
      pageNum: '&page=' + this.data.pageNum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        pageNum: 1
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
    this.orderList(this.data.sreachKey)
    wx.removeStorageSync('money');
    this.setData({
      remarks: ''
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