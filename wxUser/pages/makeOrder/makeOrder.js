// pages/makeOrder/makeOrder.js
let app = getApp();
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payArray: ['在线支付', '现金', '到付', '回单付', '预付', '月付'],
    index: 0,
    isChecked: true,
    isChecked1: true,
    dateTime: null,
    dateTimeArray: null,
    okBtn: false,
    hiddenmodalput: true,
    remarksTip: '选填',
    remarks: '',
    cargoInfo: '必填',
    consignorPeron: '请输入寄件人信息',
    consigneePeron: '请输入收件人信息',
    dateTimeCon: '当天',
    collectingDistance: '',         //揽收距离
    transitDistance: '',            //干线距离
    deliveryDistance: ''            //派送距离
  },

  // 付款方式
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  // 显示modal框
  hiddenmodalput: function () {
    let remarks = this.data.remarksTip == '选填' ? '' : this.data.remarksTip
    this.setData({
      hiddenmodalput: false,
      remarks: remarks
    })
  },

  remarksChange: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  cancel: function () {
    this.setData({
      remarks: '',
      hiddenmodalput: true
    })
  },
  confirm: function (e) {
    let remarks = this.data.remarks.length < 1 ? '选填' : this.data.remarks
    this.setData({
      remarks: remarks,
      remarksTip: remarks,
      hiddenmodalput: true
    })
  },

  // 时间插件监听事件
  changeDateTime: function (e) {
    let dateTimeArray = this.data.dateTimeArray;
    let dateTime = e.detail.value
    this.setData({ 
      dateTimeCon: dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[1][dateTime[1]] +'-'+dateTimeArray[2][dateTime[2]] +' '+ dateTimeArray[3][dateTime[3]] +':'+dateTimeArray[4][dateTime[4]]
    });
  },
  bindDateChange: function (e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr
    });
  },

  // 初始化时间插件
  dateInt: function () {
    var nowDate = new Date();
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(nowDate.getFullYear(), nowDate.getFullYear() + 10);
    // 精确到分的处理，将数组的秒去掉
    obj.dateTimeArray.pop();
    obj.dateTime.pop();
    this.setData({
      dateTimeArray: obj.dateTimeArray,
      dateTime: obj.dateTime
    })
  },

  radioChange: function (e) {
    this.setData({ isChecked: !this.data.isChecked });
    this.calculatefreightnew(app.setCargoInfo)
  },
  radioChange1: function (e) {
    this.setData({ isChecked1: !this.data.isChecked1 })
    this.calculatefreightnew(app.setCargoInfo)
  },
  // 地址显示判断
  differentiateAddress: function () {
    let dataStart = wx.getStorageSync('start');
    let dataStart1 = wx.getStorageSync('consignor');
    let dataEnd = wx.getStorageSync('end');
    let dataEnd1 = wx.getStorageSync('consignee');
    // console.log(dataStart, dataStart1, dataEnd, dataEnd1)
    // 写入发货信息
    if (dataStart) {
      dataStart.province_str = dataStart.province_str ? dataStart.province_str : dataStart.city_str;
      this.setData({
        consignorPeron: dataStart.name + ' ' + dataStart.mobile,
        consignorAddress: dataStart.province_str + dataStart.city_str + dataStart.area_str + dataStart.address
      })
    } else if (dataStart1) {
      this.setData({
        consignorPeron: dataStart1.consignor_name + ' ' + dataStart1.consignor_mobile,
        consignorAddress: dataStart1.start_province + dataStart1.start_city + dataStart1.start_area + dataStart1.start_full_address
      })
    } else {
      // 设置默认发货信息
      app.postNetNoParam({
        requestType: 'POST',
        method: 'user/useraddress_default',
        param: {},
        successFull: (res) => {
          wx.setStorage({
            key: 'start',
            data: res.result,
            success: (res) => {
              this.differentiateAddress();
            }
          })
        },
        err: (res) => {
          wx.showToast({
            title: '请检查网络！',
            icon: 'none'
          })
        }
      })
    };
    // 写入收货信息
    if (dataEnd) {
      dataEnd.province_str = dataEnd.province_str ? dataEnd.province_str : dataEnd.city_str;
      this.setData({
        consigneePeron: dataEnd.name + ' ' + dataEnd.mobile,
        consigneeAddress: dataEnd.province_str + dataEnd.city_str + dataEnd.area_str + dataEnd.address
      })
    } else if (dataEnd1) {
      this.setData({
        consigneePeron: dataEnd1.consignee_name + ' ' + dataEnd1.consignee_mobile,
        consigneeAddress: dataEnd1.end_province + dataEnd1.end_city + dataEnd1.end_area + dataEnd1.end_full_address
      })
    }
  },
  // 货物信息展示
  showDetail: function(detail){
    console.log(detail);
    if(detail){
      let goodsMsg = detail.goods_weight == 0 ? detail.goods_volume + 'vol' : detail.goods_weight + 'kg'
      this.setData({
        cargoInfo: detail.goods_name + ' ' + goodsMsg + ' ' + detail.num+ '件'
      })
    }
  },

  // 校验信息并显示价格
  calculatefreightnew: function(goods_info){
    let that = this
    if (!goods_info) return false
    let dataStart = wx.getStorageSync('start');
    let dataStart1 = wx.getStorageSync('consignor');
    let dataEnd = wx.getStorageSync('end');
    let dataEnd1 = wx.getStorageSync('consignee');
    // 经纬度顺序有可能不对
    let params = {
      startProvince: dataStart ? dataStart.province : dataStart1.provinceCode,
      startCity: dataStart ? dataStart.city : dataStart1.cityCode,
      startArea: dataStart ? dataStart.area : dataStart1.areaCode,
      startGpsY: dataStart ? dataStart.gps_x : dataStart1.start_gps_x,
      startGpsX: dataStart ? dataStart.gps_y : dataStart1.start_gps_y,
      endProvince: dataEnd ? dataEnd.province : dataEnd1.provinceCode,
      endCity: dataEnd ? dataEnd.city : dataEnd1.cityCode,
      endArea: dataEnd ? dataEnd.area : dataEnd1.areaCode,
      endGpsY: dataEnd ? dataEnd.gps_x : dataEnd1.end_gps_x,
      endGpsX: dataEnd ? dataEnd.gps_y : dataEnd1.end_gps_y,
      goodsWeight: goods_info.goods_weight,
      goodsVolume: goods_info.goods_volume,
      loadingFee: "0",
      packagingFee: '0',
      selfPickUpFreight: this.data.isChecked ? '1' : '0',
      selfSendFreight: this.data.isChecked1 ? '1' : '0',
      unLoadingFee: '0'
    }
    wx.request({
      url: 'http://interface.paigekuaiyun.com/CalculateFreightBySubBilling',
      data: {
        info: JSON.stringify(params)
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1003){
          // 该地区未建立服务网点
          wx.showToast({
            title: res.data.errorCode, //提示内容
            icon: 'none', //图标，只支持"success"、"loading"
            duration: 2000 //提示延迟时间，单位毫秒。默认1500，最大为10000
          })
        }else {
          that.setData({
            collectingDistance: res.data.result.collectingDistance,
            transitDistance: res.data.result.transitDistance,
            deliveryDistance: res.data.result.deliveryDistance,
            freight: app.changeTwoDecimal_f(res.data.result.price),
            okBtn: true
          })
        }
      },
      fail: function (res) {
        app.errTip()
      }
    })
  },
  // 下单
  makeOrderTap: function(){
    if (this.data.okBtn) {
      let dataStart = wx.getStorageSync('start');
      let dataStart1 = wx.getStorageSync('consignor');
      let dataEnd = wx.getStorageSync('end');
      let dataEnd1 = wx.getStorageSync('consignee');
      let goodsInfo = app.setCargoInfo;
      let params = {
        consignor_name: dataStart1.consignor_name ? dataStart1.consignor_name : dataStart.name,
        consignor_mobile: dataStart1.consignor_mobile ? dataStart1.consignor_mobile : dataStart.mobile,
        start_province: dataStart1.provinceCode ? dataStart1.provinceCode : dataStart.province,
        start_city: dataStart1.cityCode ? dataStart1.cityCode : dataStart.city,
        start_area: dataStart1.areaCode ? dataStart1.areaCode : dataStart.area,
        start_full_address: dataStart1.start_full_address ? dataStart1.start_full_address : dataStart.address,
        start_gps_x: dataStart1.start_gps_x ? dataStart1.start_gps_x : dataStart.gps_x,
        start_gps_y: dataStart1.start_gps_y ? dataStart1.start_gps_y : dataStart.gps_y,
        consignee_name: dataEnd1.consignee_name ? dataEnd1.consignee_name : dataEnd.name,
        consignee_mobile: dataEnd1.consignee_mobile ? dataEnd1.consignee_mobile : dataEnd.mobile,
        end_province: dataEnd1.provinceCode ? dataEnd1.provinceCode : dataEnd.province,
        end_city: dataEnd1.cityCode ? dataEnd1.cityCode : dataEnd.city,
        end_area: dataEnd1.areaCode ? dataEnd1.areaCode : dataEnd.area,
        end_full_address: dataEnd1.end_full_address ? dataEnd1.end_full_address : dataEnd.address,
        end_gps_x: dataEnd1.end_gps_x ? dataEnd1.end_gps_x : dataEnd.gps_x,
        end_gps_y: dataEnd1.end_gps_y ? dataEnd1.end_gps_y : dataEnd.gps_y,
        goods_name: goodsInfo.goods_name,
        goods_count: goodsInfo.num,
        goods_weight: goodsInfo.goods_weight,
        goods_volume: goodsInfo.goods_volume,
        goods_type: goodsInfo.goods_type,
        deal_price: this.data.freight * 100,
        selfpickup_freight: this.data.isChecked ? '5000' : '0',
        selfsend_freight: this.data.isChecked1 ? '4000' : '0',
        pay_type: "2",
        osCode: "4",
        remarks: this.data.remarks, 
        take_time: this.data.dateTimeCon,
        collecting_distance: this.data.collectingDistance,
        transit_distance: this.data.transitDistance,
        delivery_distance: this.data.deliveryDistance,
        goods_class: goodsInfo.goods_type,
        price: app.changeTwoDecimal_f(this.data.freight * 100)
      }
      // console.log(params)
      app.postNetNoParam({
        requestType: 'POST',
        method: 'index/createAdd',
        param: params,
        successFull: (res) => {
          wx.showToast({
            title: '下单成功',
            duration: 3000,
            success: (res) => {
              wx.switchTab({
                url: '/pages/searchOrder/searchOrder'
              })
            }
          })
        },
        err: (res) => {
          app.errTip()
        }
      })
    }
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
    // 地址判断显示
    this.differentiateAddress();
    // this.price();
    // 时间插件
    this.dateInt();
    // 货物信息
    this.showDetail(app.setCargoInfo)
    // 判断价格显示
    this.calculatefreightnew(app.setCargoInfo)
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