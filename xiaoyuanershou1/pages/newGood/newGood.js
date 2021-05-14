let app = getApp();
//云数据库相关
const db = wx.cloud.database({});

Page({
  data: {
    searchKey: '', //搜索词
    goodList: [], //商品 
  },
  //去商品详情页
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?goodid=' + e.currentTarget.dataset.id
    })
  },

  onLoad(e) {
    let searchKey = e.searchKey
    if (searchKey) {
      //搜索商品
      this.getList('search', searchKey)
      this.setData({
        searchKey: searchKey //搜索词
      })
      wx.setNavigationBarTitle({
        title: '搜索商品'
      })
    } else {
      //获取最新的商品
      this.getList('getNew')
      wx.setNavigationBarTitle({
        title: '新品推荐'
      })
    }
  },
  //获取用户输入的搜索词
  getSearchKey(e) {
    this.setData({
      searchKey: e.detail.value //搜索词
    })
  },
  //搜索事件
  goSearch() {
    this.getList('search', this.data.searchKey)
  },
  //获取数据
  getList(action, searchKey) {
    wx.cloud.callFunction({
      name: "getGoodList",
      data: {
        action: action,
        searchKey: searchKey
      }
    }).then(res => {
      let dataList = res.result.data;
      console.log("商品数据", res)
      this.setData({
        goodList: dataList,
      })
    }).catch(res => {
      console.log("菜品数据请求失败", res)
    })
  },
})