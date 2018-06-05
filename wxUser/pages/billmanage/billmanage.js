// pages/billmanage/billmanage.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: false,
    blag: true,
    blagBottm: true,
    isEmpty: true,
    items: [],
    itemsId: '',
    lastPrice: '0.00',
    pageNum: '1',
    allCheckeds: false,
    allChecked: false,
    itemsAllId: '',
    lastAllPrice: '',
    itemListS: []
  },

  tabToggle: function () {
    // this.getSchedule(this.data.orderNum)
    this.setData({
      list: false,
      blag: true
    })
    this.list()
  },
  tabToggle1: function () {
    this.setData({
      list: true,
      blag: false
    })
    this.blag()
  },
  goBlag: function(){
    if (this.data.itemsId){
      wx.navigateTo({
        url: '/pages/getbillinfo/getbillinfo?ids=' + this.data.itemsId + '&acount=' + this.data.lastPrice
      })
    } else {
      wx.showToast({
        title: '请选择发票',
        icon: 'none',
        mask: true
      })
    }
  },
  // 选中计算
  radioChange: function (e) {
    let valueS = e.detail.value
    let lastPrice = 0;
    for (let i in valueS){
      lastPrice += parseInt(valueS[i])
    }
    this.setData({
      lastPrice: lastPrice == 0 ? '0.00' : lastPrice
    })
  },
  // 点击选择
  labelTap: function(e){
    let thisId = e.currentTarget.dataset.id;
    let itemsId = this.data.itemsId;
    if (itemsId.indexOf(thisId) == -1){
      if(itemsId){
        itemsId += ',' + thisId
      }else{
        itemsId += thisId
      }
    } else {
      itemsId = itemsId.replace(thisId, '');
      let itemsArr = itemsId.split(',');
      let emptyIndex = itemsArr.indexOf('');
      if(emptyIndex > -1){
        itemsArr.splice(emptyIndex, 1);
      }
      itemsId = itemsArr.join(',')
    }
    this.setData({
      itemsId: itemsId,
      allChecked: false
    })
    // console.log(this.data.itemsId)
  },
  checkboxChange: function(e){
    this.setData({
      allCheckeds: !this.data.allChecked,
      allChecked: !this.data.allChecked
    })
    if (!this.data.allChecked){
      this.setData({
        itemsId: '',
        lastPrice: '0.00'
      })
    }else{
      this.setData({
        itemsId: this.data.itemsAllId,
        lastPrice: this.data.lastAllPrice
      })
    }
  },
  // // 获取更多
  // bindscrolltolower: function (e) {
  //   this.setData({
  //     pageNum: this.data.pageNum + 1
  //   })
  //   this.blag()
  // },
  // // 获取更多
  // bindscrolltolower1: function (e) {
  //   this.setData({
  //     pageNum: this.data.pageNum + 1
  //   })
  //   this.blag()
  // },
  // 发票列表
  list: function () {
    app.postNetNoParam({
      requestType: 'POST',
      method: 'invoice/invoice_list',
      param: {},
      successFull: (res) => {
        let datas = res.result.data
        this.setData({
          itemListS: datas,
          isEmpty: true
        })
        console.log(datas)
      },
      msgFull: (res) => {
        this.setData({
          isEmpty: false
        })
      },
      err: (res) => {
        app.errTip()
      }
    })
  },
  // 索要发票
  blag: function(){
    app.postNetNoParam({
      requestType: 'POST',
      method: 'invoice/invoice_create',
      param: {},
      successFull: (res) => {
        let datas = res.result.data
        console.log(datas)
        this.setData({
          blagBottm: true
        })
        let items = this.data.items;
        let itemsAllId = new Array();
        let lastAllPrice = null;
        for (let i in datas){
          itemsAllId.push(datas[i].id);
          lastAllPrice += parseInt(datas[i].deal_price/100)
        }
        this.setData({
          items: items,
          itemsAllId: itemsAllId.join(','),
          lastAllPrice: lastAllPrice,
          isEmpty: true
        })
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
    this.list()
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