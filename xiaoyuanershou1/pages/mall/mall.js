let app = getApp();
//云数据库相关
const db = wx.cloud.database({});
let windowHeight = 0
Page({
  data: {
    cartList: [], // 购物车
    totalPrice: 0, // 总价，初始为0
    totalNum: 0, //总数，初始为0
    // 购物车动画
    animationData: {},
    animationMask: {},
    maskVisual: "hidden",
    maskFlag: true,
    // 分类相关
    menuArr: [],
    leftActiveNum: 0,
    Tab: 0,
    heightArr: [] //用来存储右侧每个条目的高度
  },
  //去商品详情页
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?goodid=' + e.currentTarget.dataset.id
    })
  },
  onLoad(e) {
    //获取商品数据
    this.getList()
  },
  //获取商品数据
  getList() {
    //获取购物车商品
    let cartList = wx.getStorageSync('cart') || [];
    wx.cloud.callFunction({
      name: "getGoodList",
      data: {
        action: 'getAll'
      }
    }).then(res => {
      let dataList = res.result.data;
      console.log("商品数据", res)
      //遍历1,并把购物车购买数量填充进来
      dataList.forEach(good => {
        good.quantity = 0;
        cartList.forEach(cart => {
          if (cart._id == good._id) {
            good.quantity = cart.quantity ? cart.quantity : 0;
          }
        })
      });
      //遍历2，进行分类
      // arr 传过来的原数组
      let tempArr = [];
      let endData = [];
      dataList.forEach(item => {
        if (tempArr.indexOf(item.type) === -1) {
          endData.push({
            title: item.type,
            list: [item]
          });
          tempArr.push(item.type);
        } else {
          for (let j = 0; j < endData.length; j++) {
            if (endData[j].title == item.type) {
              endData[j].list.push(item);
              break;
            }
          }
        }
      })
      //过滤数组，添加id
      endData.map((item, index) => {
        item.id = index
      })
      console.log('过滤后', endData)
      this.setData({
        cartList: cartList,
        menuArr: endData,
      })
      this.getTotalPrice()
      this.getHeightArr()
    }).catch(res => {
      console.log("商品数据请求失败", res)
    })
  },

  //购物车减少数量
  minusCount(e) {
    let item = e.currentTarget.dataset.item;
    let cartList = wx.getStorageSync('cart') || [];
    let menuArr = this.data.menuArr
    menuArr.forEach(v => {
      v.list.forEach(v2 => {
        if (v2._id == item._id) {
          if (v2.quantity && v2.quantity > 0) {
            v2.quantity -= 1;
          } else {
            v2.quantity = 0;
          }
          if (cartList.length > 0) {
            for (let j in cartList) {
              if (cartList[j]._id == item._id) {
                cartList[j].quantity ? cartList[j].quantity -= 1 : 0
                if (cartList[j].quantity <= 0) {
                  //购买数里为0就从购物车里删除
                  this.removeByValue(cartList, item._id)
                }
                if (cartList.length <= 0) {
                  this.setData({
                    cartList: [],
                    totalNum: 0,
                    totalPrice: 0,
                  })
                  // this.cascadeDismiss()
                }
                try {
                  wx.setStorageSync('cart', cartList)
                } catch (e) {
                  console.log(e)
                }
              }
            }
          }
        }
      })
    })
    this.setData({
      cartList: cartList,
      menuArr: menuArr
    })
    this.getTotalPrice();
  },
  // 定义根据id删除数组的方法
  removeByValue(array, id) {
    for (var i = 0; i < array.length; i++) {
      if (array[i]._id == id) {
        array.splice(i, 1);
        break;
      }
    }
  },

  // 购物车增加数量
  addCount(e) {
    let item = e.currentTarget.dataset.item;
    let arr = wx.getStorageSync('cart') || [];
    let f = false;
    let menuArr = this.data.menuArr
    menuArr.forEach(v => { // 遍历菜单找到被点击的商品，数量加1
      v.list.forEach(v2 => {
        if (v2._id == item._id) {
          //购买数量超过剩余数量
          if (v2.quantity >= item.num) {
            wx.showToast({
              icon: 'none',
              title: '超过可购买数量',
            })
            return;
          }
          v2.quantity += 1;

          if (arr.length > 0) {
            for (let j in arr) { // 遍历购物车找到被点击的商品，数量加1
              if (arr[j]._id == item._id) {
                arr[j].quantity += 1;
                f = true;
                try {
                  wx.setStorageSync('cart', arr)
                } catch (e) {
                  console.log(e)
                }
                break;
              }
            }
            if (!f) {
              arr.push(v2);
            }
          } else {
            arr.push(v2);
          }
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          // break;
        }
      })

    })

    this.setData({
      cartList: arr,
      menuArr: menuArr
    })
    this.getTotalPrice();
  },


  // 获取购物车总价、总数
  getTotalPrice() {
    var cartList = this.data.cartList; // 获取购物车列表
    var totalP = 0;
    var totalN = 0
    for (var i in cartList) { // 循环列表得到每个数据
      totalP += cartList[i].quantity * cartList[i].price; // 所有价格加起来     
      totalN += cartList[i].quantity
    }
    this.setData({ // 最后赋值到data中渲染到页面
      cartList: cartList,
      totalNum: totalN,
      totalPrice: totalP.toFixed(2)
    });
  },
  // 清空购物车
  cleanList(e) {
    let menuArr = this.data.menuArr
    menuArr.forEach(v => {
      v.list.forEach(v2 => {
        v2.quantity = 0
      })
    })
    try {
      wx.setStorageSync('cart', "")
    } catch (e) {
      console.log(e)
    }
    this.setData({
      menuArr: menuArr,
      cartList: [],
      totalNum: 0,
      totalPrice: 0,
    })
    this.cascadeDismiss()
  },

  //删除购物车单项
  deleteOne(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var arr = wx.getStorageSync('cart')
    let menuArr = this.data.menuArr
    menuArr.forEach(v => {
      v.list.forEach(v2 => {
        if (v2._id == id) {
          v2.quantity = 0;
        }
      })
    })
    arr.splice(index, 1);
    if (arr.length <= 0) {
      this.setData({
        menuArr: menuArr,
        cartList: [],
        totalNum: 0,
        totalPrice: 0,
      })
      this.cascadeDismiss()
    }
    try {
      wx.setStorageSync('cart', arr)
    } catch (e) {
      console.log(e)
    }
    this.setData({
      cartList: arr,
      menuArr: menuArr
    })
    this.getTotalPrice()
  },
  //切换购物车开与关
  cascadeToggle: function () {
    var that = this;
    var arr = this.data.cartList
    if (arr.length > 0) {
      if (that.data.maskVisual == "hidden") {
        that.cascadePopup()
      } else {
        that.cascadeDismiss()
      }
    } else {
      that.cascadeDismiss()
    }
  },
  // 打开购物车方法
  cascadePopup: function () {
    var that = this;
    // 购物车打开动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(0.8).step();
    that.setData({
      animationMask: that.animationMask.export(),
      maskVisual: "show",
      maskFlag: false,
    });
  },
  // 关闭购物车方法
  cascadeDismiss: function () {
    var that = this
    // 购物车关闭动画
    that.animation.translate(0, 285).step();
    that.setData({
      animationData: that.animation.export()
    });
    // 遮罩渐变动画
    that.animationMask.opacity(0).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
    // 隐藏遮罩层
    that.setData({
      maskVisual: "hidden",
      maskFlag: true
    });
  },
  // 跳转确认订单页面
  gotoOrder: function () {
    var arr = wx.getStorageSync('cart') || [];
    if (!arr || arr.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择商品'
      })
      return;
    }

    let userInfo = app.globalData.userInfo;
    if (!userInfo || !userInfo.nickName) {
      this.showLoginView()
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },
  /**
   * 分类相关
   */

  getHeightArr() {
    let _this = this;
    // setTimeout(() => {
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        console.log("windowHeight", windowHeight) //最后获得转化后得rpx单位的窗口高度
      }
    })
    // 获得每个元素据顶部的高度， 组成一个数组， 通过高度与scrollTop的对比来知道目前滑动到那个区域
    let heightArr = [];
    let h = 0;
    //创建节点选择器
    const query = wx.createSelectorQuery();
    //选择id
    query.selectAll('.rightblock').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      //res就是 所有标签为contlist的元素的信息 的数组
      res[0].forEach((item) => {
        //这里的高度是每个栏目块到顶部的距离
        h += item.height;
        heightArr.push(h);
      })
      _this.setData({
        heightArr: heightArr
      })
    })
    console.log("heightArr", heightArr)

    // }, 300)
  },

  //点击左侧栏目
  leftClickFn(e) {
    this.setData({
      leftActiveNum: e.target.dataset.myid,
      Tab: e.target.dataset.myid
    })
    console.log('点击了')
  },
  //右侧滚动时触发这个事件
  rightScrollFn(e) {
    let wucha = 15 //避免部分机型上有问题，给出一个误差范围
    let st = e.detail.scrollTop;
    let myArr = this.data.heightArr;
    // console.log("st", st)
    // console.log("myArr", myArr)
    for (let i = 0; i < myArr.length; i++) {
      //找出是滚动到了第一个栏目，然后设置栏目选中状态
      if (st >= myArr[i] && st < myArr[i + 1] - wucha) {
        console.log("找到的i", i)
        this.setData({
          leftActiveNum: i + 1
        });
        return;
      } else if (st < myArr[0] - wucha) {
        this.setData({
          leftActiveNum: 0
        });
      }

    }
  },

  //弹起登录弹窗
  showLoginView() {
    this.setData({
      isShowAddressSetting: true
    })
  },
  //关闭登录弹窗
  closeLoginView() {
    this.setData({
      isShowAddressSetting: false
    })
  },
  //授权登录
  goLogin() {
    wx.getUserProfile({
      desc:'用于展示在页面中',
      success:(res) =>{
        console.log("获取用户信息成功",res)
        if(res.userInfo){
          let user = res.userInfo;
          this.setData({
            isShowAddressSetting: false
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
      }
    })
  },
})