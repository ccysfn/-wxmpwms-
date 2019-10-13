// pages/barCode/gen.js
const wxbarcode = require('wxbarcode')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wl:[],
    hw:[],
    inputValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
      wx.request({
        url: 'https://jessecao.club/public/index.php/wxuser/Index/wlzdApi',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          //console.log(res.data)
          that.setData({
            wl:res.data
          })
        }
      })

    wx.request({
      url: 'https://jessecao.club/public/index.php/wxuser/Index/hwApi',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        that.setData({
          hw: res.data
        })
      }
    })

  //  wxbarcode.barcode('barcode', '1234567890123456789', 680, 200);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  inputConfirm:function(e){
    //console.log(e.detail.value)
    this.data.inputValue = e.detail.value


  },
  inputBarcode: function (e) {
    //console.log(this.data.inputValue)
    wxbarcode.qrcode('qrcode', this.data.inputValue, 250, 250);

  },
  barcode:function(e){
    var v_cs = e.currentTarget.dataset.cs
    wxbarcode.qrcode('qrcode', v_cs, 250, 250);

  },
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