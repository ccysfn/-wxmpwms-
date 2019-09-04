// pages/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wlresult: '',
    hwResult: '',
    sl: null,
    todoCodeIndex: 0,
    todoCodes: ["操作","入库", "出库"],
  },
  copyLink: function(){
    wx.setClipboardData({
      data: 'https://jessecao.club/public/index.php/wxuser/Index/main',
      success(res) {
        wx.showModal({
          content: '链接已复制，请在网页浏览器中打开',
          showCancel: false,
        })
      }
    })

  },

  scan: function() {
    var that = this
    wx.scanCode({
      success(res) {
        console.log(res)
        that.setData({
          wlresult: res.result

        })
      }
    })
  },

  scanhw: function() {
    var that = this
    wx.scanCode({
      success(res) {
        //console.log(res)
        that.setData({
          hwResult: res.result

        })
      }
    })
  },

  bindKeyInput: function(e) {
    this.data.sl = e.detail.value
    this.setData({
      sl: e.detail.value
    })
  },

  bindCountryCodeChange: function (e) {
   // console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      todoCodeIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  confirm:function(){
    var index = this.data.todoCodeIndex
    console.log(index);
    if(index==1){
      console.log(index);
           this.rk()
    }else if (index==2){
          this.ck()
    }
    else{
      wx.showModal({
        content: '请选择操作',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    

  },

  rk: function() {
   // console.log(this.data.wlresult)
    //console.log(this.data.hwResult)
   // console.log(this.data.sl)
    if (this.data.wlresult == '' ||
      this.data.hwResult == '' ||
      this.data.sl == null) {
      console.log('请将参数录入完整')
      wx.showToast({
        title: '请将数据录入完整',
        icon: 'success',
        duration: 3000
      });
    } else {
        //console.log(this.data.hwResult)
      wx.request({
        url: 'https://jessecao.club/public/index.php/wxuser/Index/index', //仅为示例，并非真实的接口地址
        data: {
          hw: this.data.hwResult,
          wlbh: this.data.wlresult,
          sl: this.data.sl,
          ywy: 'admin',
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          //console.log(res)
          console.log('success')
          wx.showToast({
            title: '已完成',
            icon: 'success',
            duration: 3000
          });
        }
      })
      this.data.hwResult = null
      this.data.wlresult = null
      this.data.sl = null
      this.setData({
        hwResult: this.data.hwResult,
        wlresult: this.data.wlresult,
        sl: this.data.sl
      })
    }
  },

  ck: function() {
    //console.log(this.data.wlresult)
    if (this.data.wlresult == '' ||
      this.data.hwResult == '' ||
      this.data.sl == null) {
      console.log('请将参数录入完整')
      wx.showToast({
        title: '请将数据录入完整',
        icon: 'success',
        duration: 3000
      });
    } else {
      //  console.log(this.data.hwResult)
      wx.request({
        url: 'https://jessecao.club/public/index.php/wxuser/Index/kcckd', //仅为示例，并非真实的接口地址
        data: {
          hw: this.data.hwResult,
          wlbh: this.data.wlresult,
          sl: this.data.sl,
          ywy: 'admin',
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          //console.log(res.data)
          if (res.data == '出库成功') {
            wx.showToast({
              title: '出库成功',
              icon: 'success',
              duration: 3000
            });
          } else {
            wx.showModal({
              content: res.data,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          }

        }
      })
      this.data.hwResult = null
      this.data.wlresult = null
      this.data.sl = null
      this.setData({
        hwResult: this.data.hwResult,
        wlresult: this.data.wlresult,
        sl: this.data.sl
      })
    }
  }
})