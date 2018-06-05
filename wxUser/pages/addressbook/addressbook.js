// pages/addressbook/addressbook.js
let app = getApp();
var qqMap = require('../../utils/qqmap-wx-jssdk.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: null,
    isChecked: null,
    addressContent: '',
    whichType: 'start',
    personWhich: 'consignor',
    isAdd: true,
    addShow: true,
    action: 'add',
    isdefault: 0,
    addressId: null
  },

  openAddress: function () {
    wx.chooseLocation({
      success: (res) => {
        let newAddress = app.regexPCA(res.address)
        this.setData({
          address: newAddress.REGION_PROVINCE + newAddress.REGION_CITY + newAddress.REGION_COUNTRY,
          province: newAddress.REGION_PROVINCE,
          city: newAddress.REGION_CITY,
          area: newAddress.REGION_COUNTRY,
          full_address: newAddress.ADDRESS,
          gps_x: res.latitude,
          gps_y: res.longitude
        })
      }
    })
  },

  // 提交表单
  formSubmit: function (e) {
    let formValue = e.detail.value;
    let that = this;
    // 判断是否还有地址信息未完善
    for (let every in formValue) {
      if (formValue[every].length < 1) {
        wx.showToast({
          title: '请完善信息！',
          mask: true,
          icon: 'none'
        })
        return false
      }
    };

    app.postNetNoToken({
      requestType: 'POST',
      method: 'index/change_citycode',
      param: {
        province_str: formValue.start_province ? formValue.start_province : formValue.end_province,
        city_str: formValue.start_city ? formValue.start_city : formValue.end_city,
        area_str: formValue.start_area ? formValue.start_area : formValue.end_area
      },
      successFull: function (e) {
        let codes = e.result;
        let params = {
          name: formValue.consignor_name ? formValue.consignor_name : formValue.consignee_name,
          mobile: formValue.consignor_mobile ? formValue.consignor_mobile : formValue.consignee_mobile,
          address: formValue.start_full_address ? formValue.start_full_address : formValue.end_full_address,
          gps_x: formValue.start_gps_x ? formValue.start_gps_x : formValue.end_gps_x,
          gps_y: formValue.start_gps_y ? formValue.start_gps_y : formValue.end_gps_y,
          action: that.data.action,
          id: that.data.addressId,
          isdefault: that.data.isdefault
        };
        formValue.provinceCode = params.province = codes[0].province_code;
        formValue.cityCode = params.city = codes[1].city_code;
        formValue.areaCode = params.area = codes[2].area_code;
        if (that.data.isChecked) {
          // 地址修改or添加
          app.postNetNoParam({
            requestType: 'POST',
            method: 'user/useraddress_add',
            param: params,
            successFull: function (e) {
              wx.showToast({
                title: '操作成功',
                mask: true,
                duration: 3000,
                success: (res) => {
                  wx.setStorage({
                    key: that.data.personWhich,
                    data: formValue,
                    success: (res) => { 
                      if (that.data.personWhich == 'consignor') {
                        wx.removeStorage({ key: 'start' })
                      } else if (that.data.personWhich == 'consignee') {
                        wx.removeStorage({ key: 'end' })
                      }
                    }
                  })
                  wx.navigateBack()
                }
              })
            },
            errDefault: function (e) {
              wx.showModal({
                title: '操作失败',
                content: e.msg,
                showCancel: false,
                success: (res) => {
                  if (res.confirm) {
                    // 跳转到首页
                    wx.navigateBack({
                      delta: 10
                      // url: '/pages/index/index'
                    })
                  }
                }
              })
            }
          })
        } else {
          wx.setStorage({
            key: that.data.personWhich,
            data: formValue,
            success: (res) => { 
              wx.navigateBack()
              if (that.data.personWhich == 'consignor') {
                wx.removeStorage({ key: 'start' })
              } else if (that.data.personWhich == 'consignee') {
                wx.removeStorage({ key: 'end' })
              }
            }
          })
        }
      }
    })
  },

  // 切换radio
  radioChange: function (e) {
    this.setData({
      isChecked: !this.data.isChecked
    })
  },

  // 上传图片识别文字
  openCamera: function (e) {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.showLoading({
          title: '识别中...',
          mask: true
        });
        // 图片上传识别
        wx.uploadFile({
          url: app.fileUrl + 'index/login/img_change_text',
          filePath: res.tempFilePaths[0],
          name: 'img',
          success: (res) => {
            let addressContentArr = JSON.parse(res.data).result.words_result;
            let addressContent = '';
            for (let i = 0; i < addressContentArr.length; i++) {
              addressContent += addressContentArr[i].words + '，'
            }
            that.setData({ addressContent: addressContent })
            wx.hideLoading()
          }
        })
      }
    })
  },

  // 清除地址内容
  clearAddressTextarea: function () {
    this.setData({ addressContent: '' })
  },
  addressContent: function (e) {
    this.setData({ addressContent: e.detail.value })
  },
  // 动态获取坐标
  getCoder: function (address) {
    let that = this;
    let QQMapWX = new qqMap({
      key: 'C64BZ-EEBKQ-LH754-G3SHZ-ZUIH7-XBBDQ'
    })

    //地址解析(地址转坐标)     
    QQMapWX.geocoder({
      address: address,
      success: function (res) {
        console.log(res.result);
        that.setData({
          gps_x: res.result.location.lat,
          gps_y: res.result.location.lng
        })
      },
      fail: function (res) {
        // console.log(res);
        wx.showToast({
          title: '请检查网络',
        })
      }
    });
  },
  // 识别地址
  doIt: function () {
    let that = this
    if (this.data.addressContent)
      // 文字识别
      app.postNetNoParam({
        requestType: 'POST',
        method: 'index/index/text_ocr',
        param: {
          content: this.data.addressContent
        },
        successFull: function (e) {
          that.getCoder(e.result.address)
          let newAddress = app.regexPCA(e.result.address)
          // console.log(newAddress)
          that.setData({
            name: e.result.name,
            mobile: e.result.mobile,
            address: newAddress.REGION_PROVINCE + newAddress.REGION_CITY + newAddress.REGION_COUNTRY,
            province: newAddress.REGION_PROVINCE,
            city: newAddress.REGION_CITY,
            area: newAddress.REGION_COUNTRY,
            full_address: newAddress.ADDRESS
          })
        },
        errDefault: function (e) {
          app.tastWarn(e.msg)
        }
      })
    else
      app.tastWarn('请输入地址')
  },

  // 区分是点击地址还是输入地址
  differentiateAddress: function (options) {
    let dataStart = wx.getStorageSync('start');
    let dataStart1 = wx.getStorageSync('consignor');
    let dataEnd = wx.getStorageSync('end');
    let dataEnd1 = wx.getStorageSync('consignee');
    if (options == 'start') {
      if (dataStart) {
        dataStart.province_str = dataStart.province_str ? dataStart.province_str : dataStart.city_str;
        this.setData({
          name: dataStart.name,
          mobile: dataStart.mobile,
          address: dataStart.province_str + dataStart.city_str + dataStart.area_str,
          province: dataStart.province_str,
          city: dataStart.city_str,
          area: dataStart.area_str,
          gps_x: dataStart.gps_x,
          gps_y: dataStart.gps_y,
          full_address: dataStart.address
        })
      } else if (dataStart1) {
        this.setData({
          name: dataStart1.consignor_name,
          mobile: dataStart1.consignor_mobile,
          address: dataStart1.start_province + dataStart1.start_city + dataStart1.start_area,
          province: dataStart1.start_province,
          city: dataStart1.start_city,
          area: dataStart1.start_area,
          gps_x: dataStart1.start_gps_x,
          gps_y: dataStart1.start_gps_y,
          full_address: dataStart1.start_full_address
        })
      }
    } else if (options == 'end') {
      if (dataEnd) {
        dataEnd.province_str = dataEnd.province_str ? dataEnd.province_str : dataEnd.city_str;
        this.setData({
          name: dataEnd.name,
          mobile: dataEnd.mobile,
          address: dataEnd.province_str + dataEnd.city_str + dataEnd.area_str,
          province: dataEnd.province_str,
          city: dataEnd.city_str,
          area: dataEnd.area_str,
          gps_x: dataEnd.gps_x,
          gps_y: dataEnd.gps_y,
          full_address: dataEnd.address
        })
      } else if (dataEnd1) {
        this.setData({
          name: dataEnd1.consignee_name,
          mobile: dataEnd1.consignee_mobile,
          address: dataEnd1.end_province + dataEnd1.end_city + dataEnd1.end_area,
          province: dataEnd1.end_province,
          city: dataEnd1.end_city,
          area: dataEnd1.end_area,
          gps_x: dataEnd1.end_gps_x,
          gps_y: dataEnd1.end_gps_y,
          full_address: dataEnd1.end_full_address
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.addressId) {
      this.setData({
        addressId: options.addressId,
        addShow: false,
        action: 'edit',
        isChecked: true
      });
      app.postNetNoParam({
        requestType: 'POST',
        method: 'user/useraddress_show',
        param: {
          id: options.addressId
        },
        successFull: (res) => {
          let resultData = res.result;
          this.setData({
            name: resultData.name,
            mobile: resultData.mobile,
            address: resultData.province_str + resultData.city_str + resultData.area_str,
            province: resultData.province_str,
            city: resultData.city_str,
            area: resultData.area_str,
            gps_x: resultData.gps_x,
            gps_y: resultData.gps_y,
            full_address: resultData.address,
            isdefault: resultData.isdefault
          })
        },
        err: (res) => {
          wx.showToast({
            title: '获取信息失败，请检查网络！',
            icon: 'none',
            mask: true
          })
        }
      })
    } else {
      this.differentiateAddress(options.a);
      this.setData({
        isChecked: options.add ? true : false
      })
    }
    this.setData({
      status: options.a == 'start' ? '发货地' : '收货地',
      personWhich: options.a == 'start' ? 'consignor' : 'consignee',
      whichType: options.a == 'start' ? 'start' : 'end'
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