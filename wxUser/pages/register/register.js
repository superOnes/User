// pages/register/register.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person: false,
    Notperson: true,
    verificationMsg: '获取验证码',
    mobile: ''
  },
  // tab切换
  tabToggle: function () {
    // this.getSchedule(this.data.orderNum)
    this.setData({
      person: false,
      Notperson: true,
      company_name: ''
    })
  },
  tabToggle1: function () {
    this.setData({
      person: true,
      Notperson: false
    })
  },
  inputChange: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 获取验证码
  getCode: function () {
    let that = this;
    if (this.data.verificationMsg == '获取验证码') {
      if (this.data.mobile) {
        app.postNetNoToken({
          requestType: 'POST',
          method: 'login/getcode',
          param: {
            mobile: this.data.mobile
          },
          successFull: (res) => {
            wx.showToast({
              title: '发送成功',
              success: (res) => {
                let num = 60;
                let setDataFun = setInterval(function () {
                  num = num < 10 ? '0' + num : num
                  that.setData({
                    verificationMsg: num + '秒后重发'
                  })
                  console.log(num)
                  if (num == 0) {
                    that.setData({
                      verificationMsg: '获取验证码'
                    })
                    clearInterval(setDataFun)
                  }
                  num--;
                }, 1000)
              }
            })
          },
          err: (res) => {
            app.errTip()
          }
        })
      } else {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          mask: true
        })
      }
    }
  },
  // 表单提交
  formSubmit: function (e) {
    let formValue = e.detail.value;
    let pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/;
    for (let i in formValue) {
      if (this.data.person){
        if (!formValue[i]) {
          wx.showToast({
            title: '请完善信息',
            icon: 'none',
            mask: true
          })
          return false
        }
      } else {
        if (i != 'company_name'){
          if (!formValue[i]) {
            wx.showToast({
              title: '请完善信息',
              icon: 'none',
              mask: true
            })
            return false
          }
        }
      }
    }
    // 修改客户类型
    formValue.user_type = this.data.person ? '2' : '1';
    console.log(formValue)
    if (pattern.test(formValue.password)) {
      app.postNetNoParam({
        requestType: 'POST',
        method: 'login/user_reg',
        param: formValue,
        successFull: (res) => {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 3000,
            success: () => {
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/login/login'
                })
              }, 3000)
            }
          })
        },
        err: (res) => {
          app.errTip()
        }
      })
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