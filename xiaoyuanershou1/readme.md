## 1.用户授权登录和登出功能

(1)功能说明

用户在系统里进行主要操作的时候，如发布或者购买商品的时候，都会要求用户授权登录才能进行更多的操作。在微信小程序中，授权登录不需要账号填写账号密码，只需要有一个在线状态的微信，就可以通过调用微信小程序的API：wx.getUserProfile()来获取用户的微信账号信息。

## (2)授权登录界面设计



​                               ![image-20210617110457899](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110457899.png)



## 2.二手商品搜索功能

(1)功能说明

用户在搜索框内输入商品名称，即可查询到指定的商品，并且支持模糊查询，比如我搜索“会员”二字，就可以查询到所有已发布的有关会员的二手商品。

(2)界面设计

![image-20210617110510066](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110510066.png)

 







## 3.发布功能

(1)功能说明

用户在授权登录后才可以发布二手商品，否则会弹窗提示用户授权登录。发布需要填写二手商品的名称、数量、价格、分类、商品描述和上传商品图片。发布的商品将绑定用户的openid，将商品信息存储到云数据库中，商品的图片将上传到云存储中，发布完之后会清空发布页面中的信息。

(2)界面设计

![image-20210617110523351](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110523351.png)





## 4.购物车功能

(1)功能说明

用户在浏览商品的时候，可以将商品添加至购物车再一并购买。如果用户没有授权登录，将无法正常购买商品，点击购买提示用户授权登录。

(2)界面设计

![image-20210617110541368](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110541368.png)

## 5.下单功能功能

(1)功能说明

用户挑选好商品后，点击购买，就会跳转到确认订单界面，会显示购物明细，让用户选择收货地址，并选择付款方式付款，由于本系统用的是个人号开发，不能调用微信的支付api，故这里采用模拟交易的方式提交订单。

(2)界面设计

页面如下图5-6所示。

 ![image-20210617110548446](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110548446.png)



## 6.查看订单功能

(1)功能说明

用户可以查看自己的订单记录，订单分为待收货、待评价、已完成和已取消四个状态。

(2)界面设计

![image-20210617110600455](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110600455.png)



## 7.商品评价功能

(1)功能说明

用户可以对已收货的商品进行评价，评价消息会上传到云数据库，然后展现在商品详情页中。

(2)界面设计



 ![image-20210617110608782](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110608782.png)

## 8.反馈功能

(1)功能说明

用户可以提交反馈到微信公众平台的小程序后台中，管理员可以在后台查看并回复用户。



 

![image-20210617110630720](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110630720.png)



## 9.客服功能

(1)功能说明

用户可以直接在小程序内联系客服，与客服沟通。管理员可以在手机端和网页端查看和回复用户消息。网页端需要在微信公众平台里的客服板块打开网页端客服页面；手机端则需要在微信公众平台中添加客服成员，然后在手机微信上添加客服小助手小程序，即可在手机端实时查看回复用户消息。

![image-20210617110643650](C:\Users\Sherlock Lee\AppData\Roaming\Typora\typora-user-images\image-20210617110643650.png)

