// pages/scan/scan.js
const app = getApp()
Page({

  data: {
    wlresult: '',
    hwResult: '',
    sl: null,
    todoCodeIndex: 0,
    todoCodes: ["操作", "入库", "出库"],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    motto: 'Hello World',
    userInfo: {},
    encryptedData: '',
    iv: '',
    wl: [],
    hw: []
  },
  copyLink: function() {
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
        //console.log(res)
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

  checkSession: function(e) {
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        //console.log('success')
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        // wx.login() //重新登录
        // console.log('failue')
      }
    })

  },

  bindKeyInput: function(e) {
    this.data.sl = e.detail.value
    this.setData({
      sl: e.detail.value
    })
  },

  bindCountryCodeChange: function(e) {
    // console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      todoCodeIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // console.log(app.globalData.userInfo)

    that.data.hw = []
    that.data.wl = []
    wx.request({
      url: 'https://jessecao.club/public/index.php/wxuser/Index/wlzdApi',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        for (var i in res.data) {
          //console.log(res.data[i].wlbh)
          that.data.wl.push(res.data[i].wlbh)
        }
      }
    })

    wx.request({
      url: 'https://jessecao.club/public/index.php/wxuser/Index/hwApi',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        for (var i in res.data) {
          that.data.hw.push(res.data[i].lsbh)
        }
      }
    })
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        //console.log('success')
        wx.login({
          success(res) {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://jessecao.club/public/index.php/wxuser/Index/wxlogin',
                data: {
                  code: res.code
                }
              })
            } else {
              // console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        // wx.login() //重新登录
        wx.login({
          success(res) {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://jessecao.club/public/index.php/wxuser/Index/wxlogin',
                data: {
                  code: res.code
                }
              })
            } else {
              // console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      // console.log('有')
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      // console.log('无1')
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          // console.log('无2')
        }
      })
    }
    //console.log(this.data.userInfo)
  },

  getUserInfo: function(e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    })
    console.log('登录')
    console.log(this.data.encryptedData)
    console.log(this.data.iv)
    console.log(this.data.userInfo)
  },

  confirm: function() {
    var index = this.data.todoCodeIndex
    

    if (this.data.userInfo.nickName != null) {
      if (index == 1) {
        //console.log(index);
        this.rk()
      } else if (index == 2) {
        this.ck()
      } else {
        wx.showModal({
          content: '请选择操作',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      }
    } else {
      wx.showToast({
        title: '请点击授权登录',
        icon: 'success',
        duration: 3000
      });
    }
  },

  rk: function() {
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
      var v_hw = this.data.hw
      var v_wl = this.data.wl
    
      //console.log(typeof(v_wl[1]))
     // console.log(typeof (this.data.hwResult), typeof (this.data.wlresult) )
      //console.log(v_hw.indexOf(this.data.hwResult), v_wl.indexOf(this.data.wlresult))
      if (v_hw.indexOf(Number(this.data.hwResult)) != -1 && v_wl.indexOf(this.data.wlresult) != -1) {
        wx.request({
          url: 'https://jessecao.club/public/index.php/wxuser/Index/index', //仅为示例，并非真实的接口地址
          data: {
            hw: this.data.hwResult,
            wlbh: this.data.wlresult,
            sl: this.data.sl,
            ywy: this.data.userInfo.nickName,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            // console.log('success')
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
      } else {
        wx.showToast({
          title: '扫后台正确条码',
          icon: 'loading',
          duration: 3000
        });
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
  },

  ck: function() {
    //console.log(this.data.wlresult)
    if (this.data.wlresult == '' ||
      this.data.hwResult == '' ||
      this.data.sl == null) {
      //console.log('请将参数录入完整')
      wx.showToast({
        title: '请将数据录入完整',
        icon: 'loading',
        duration: 3000
      });
    } else {
      //  console.log(this.data.hwResult)
      var v_hw = this.data.hw
      var v_wl = this.data.wl
      if (v_hw.indexOf(Number(this.data.hwResult)) != -1 && v_wl.indexOf(this.data.wlresult) != -1) {
        wx.request({
          url: 'https://jessecao.club/public/index.php/wxuser/Index/kcckd', //仅为示例，并非真实的接口地址
          data: {
            hw: this.data.hwResult,
            wlbh: this.data.wlresult,
            sl: this.data.sl,
            ywy: this.data.userInfo.nickName,
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
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              });
            }
          }
        })
      } else {
        wx.showToast({
          title: '扫后台正确条码',
          icon: 'loading',
          duration: 3000
        });
      }
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