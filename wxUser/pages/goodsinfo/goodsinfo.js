// pages/goodsinfo/goodsinfo.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_count: 14,
    goods_name: '',
    goods_type: 1,
    infoType: '重量(kg)',
    toggleType: '体积',
    goods_weight: 0,
    goods_volume: 0,
    array: [],
    nameArr: [],
    index: 0,
    num: 1,
    nameSelectedId: '',
    cargoHidden: true
  },
  countChange: function(e){
    this.setData({
      goods_count: parseInt(e.detail.value)
    })
  },
  // 切换体积重量
  toggleType: function() {
    let infoType = this.data.infoType;
    let toggleType = this.data.toggleType;
    this.setData({
      infoType: infoType == '重量(kg)' ? '体积（vol）' : '重量(kg)',
      toggleType: toggleType == '体积' ? '重量' : '体积',
      goods_volume: toggleType == '体积' ? this.data.goods_count : 0,
      goods_weight: toggleType == '体积' ? 0 : this.data.goods_count,
      goods_count: 14
    })
  },
  minusCount: function (){
    this.setData({
      goods_count: this.data.goods_count == 0 ? 0 : parseInt(this.data.goods_count)-1
    })
  },
  plusCount: function (){
    this.setData({
      goods_count: parseInt(this.data.goods_count)+1
    })
  },
  // 货物类别获取
  getType: function() {
    app.postNetNoParam({
      requestType: 'GET',
      method: 'index/goods_class_map',
      param:{},
      successFull: (res) =>{
        let results = new Array;
        for (let i = 0; i< res.result.length; i++) {
          results.push(res.result[i].name)
        }
        this.setData({
          array: results
        })
      },
      err: (res) => {
        app.errTip()
      }
    })
  },

  // 货物类别选择
  bindPickerChange: function(e){
    this.setData({
      index: e.detail.value,
      goods_type: parseInt(e.detail.value) + 1
    })
  },

  // 货物名称获取
  getName: function (detail) {
    app.postNetNoParam({
      requestType: 'GET',
      method: 'index/goods_name_tag',
      param: {},
      successFull: (res) => {
        let results = res.result;
        // console.log(results)
        // 是否选择默认货物名称
        this.setData({
          nameArr: results,
          nameSelectedId: results[0].id,
          goods_name: results[0].name_tag
        })
        if (detail) {
          this.editMsg(detail)
        }
      },
      err: (res) => {
        app.errTip()
      }
    })
  },
  // 点击切换货物名称
  nameTap: function(e) {
    this.setData({
      nameSelectedId: e.currentTarget.dataset.id,
      goods_name: e.currentTarget.dataset.name
    })
    if (e.currentTarget.dataset.id == this.data.nameArr.length) {
      this.setData({
        goods_name: '',
        cargoHidden: false
      })
    } else{
      this.setData({
        cargoHidden: true
      })
    }
  },
  cargoNumChange: function(e){
    this.setData({
      goods_name: e.detail.value
    })
  },
  numChange: function(e) {
    this.setData({
      num: parseInt(e.detail.value)
    })
  },
  // 写入货物信息
  setCargoInfo: function() {
    let setCargoInfo = {
      goods_weight: this.data.toggleType == '体积' ? this.data.goods_count.toString() : '0',
      goods_volume: this.data.toggleType == '体积' ? '0' : this.data.goods_count.toString(),
      goods_type: this.data.goods_type,
      goods_name: this.data.goods_name,
      nameSelectedId: this.data.nameSelectedId,
      num: this.data.num
    }
    app.setCargoInfo = setCargoInfo;
    wx.navigateBack();
  },
  // 编辑货物信息
  editMsg: function(detail){
    let that = this
    this.setData({
      goods_count: detail.goods_volume == 0 ? detail.goods_weight : detail.goods_volume,
      nameSelectedId: detail.nameSelectedId,
      goods_name: detail.goods_name,
      cargoHidden: parseInt(detail.nameSelectedId) == that.data.nameArr.length ? false : true,
      index: detail.goods_type - 1,
      goods_type: detail.goods_type,
      goods_volume: detail.goods_volume,
      goods_weight: detail.goods_weight,
      toggleType: detail.goods_weight == 0 ? '重量' : '体积',
      infoType: detail.goods_weight == 0 ? '体积(vol)' : '重量(kg)',
      num: detail.num
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getType()
    this.getName(app.setCargoInfo)
    this.setData({
      goods_weight: this.data.goods_count
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