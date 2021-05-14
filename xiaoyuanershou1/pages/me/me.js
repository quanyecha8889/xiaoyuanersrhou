
const app = getApp();
Page({
  // 页面的初始数据
  data: {
    isShowUserName: false,
    userInfo: null,
  },
  // button获取用户信息
  // onGotUserInfo: function (e) {
  //   console.log('用户信息', e)
  //   if (e.detail.userInfo) {
  //     var user = e.detail.userInfo;
  //     this.setData({
  //       isShowUserName: true,
  //       userInfo: e.detail.userInfo,
  //     })
  //     user.openid = app.globalData.openid;
  //     app._saveUserInfo(user);
  //   } else {
  //     app.showErrorToastUtils('登陆需要允许授权');
  //   }
  // },
  
  // 官方更新后的写法
  getUserProfile(){
    wx.getUserProfile({
      desc:'用于展示在页面中',
      success:(res) =>{
        console.log("获取用户信息成功",res)
        // let user = res.userInfo
        if(res.userInfo){
          let user = res.userInfo;
          this.setData({
            isShowUserName: true,
            userInfo: res.userInfo,
          })
          user.openid = app.globalData.openid;
          app._saveUserInfo(user);
        }else{
          app.showErrorToastUtils('需要授权登录')
        }
      },
      fail:(err)=>{
        console.log(err)
        wx.showLoading({
          title: '登录失败',
          mask:true
        })
        
        setTimeout(function () {
          wx.hideLoading()
        }, 1337)
      },
    })
  },
  //退出登录
  tuichu() {
    this.setData({
      isShowUserName: false,
      userInfo: null,
    })
    app._saveUserInfo(null);
  },
  // 去我的订单页
  goToMyOrder: function () {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  // 去我的评论页
  goToMyComment: function () {
    wx.navigateTo({
      url: '/pages/myComment/myComment',
    })
  },
  //去我的发布页
  goToSeller() {
    wx.navigateTo({
      url: '/pages/seller/seller',
    })
  },
  onShow() {
    var user = app.globalData.userInfo;
    if (user && user.nickName) {
      this.setData({
        isShowUserName: true,
        userInfo: user,
      })
    }
  },
})