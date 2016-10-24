Page({
	data:{
		hiddenLoading:false,
		page:1,//页数，默认值为1
		currenttab:'',//当前切换的channelId
		channelName:'',//当前切换的channelName
		contentlist:[],//新闻列表
		scrolldirect:'',//滚动方向
		fresh:true
	},
	onShow:function(){
		wx.clearStorage();//清除缓存
	},
	onReady:function(){
		var that = this;
		//获取view高度
		
		wx.getSystemInfo({
		  success: function(res) {
		    var windowWidth = res.windowWidth;
		    var windowHeight = res.windowHeight;
		    that.setData({
		    	viewHeight:windowHeight
		    })
		  }
		});
		wx.setNavigationBarTitle({
			  title: '首页'
		})
		wx.request({
		  //必需
		  header: {
		      'apikey': '8564dae6a6594ad2f103b9227f2939de'
		  },
		  url: 'http://apis.baidu.com/showapi_open_bus/channel_news/channel_news',
		  data: {
		  
		  },
		  success: function(res) {
		  	var channelList = res.data.showapi_res_body.channelList;
		  	that.setData({
		  		channelList:channelList,
		  	})
		  	that.getResource(({
		  		channelId:channelList[0].channelId,
		  		channelName:channelList[0].name,
		  		page:1
		  	}));
		  }
		})
	},
	getResource:function(opt){
		var that= this;
		var scrolldirect = that.data.scrolldirect;
		wx.request({
		  //必需
		  url: 'http://apis.baidu.com/showapi_open_bus/channel_news/search_news',
		  data: {
		  	channelId:opt.channelId,
		  	channelName:opt.channelName,
		  	title:'',
		  	page:opt.page,
		  	needContent:1,
		  	needHtml:1
		  },
		  header: {
		     'apikey': '8564dae6a6594ad2f103b9227f2939de'
		  },
		  success: function(res) {
		  	var _res = res.data.showapi_res_body.pagebean;
		  	var _conList = _res.contentlist;
		  	_conList.forEach(function(k,v){
		  		if(k.imageurls){
		  			k.imageurls = k.imageurls.slice(0,3)
		  		}
		  	})
		  
		  	var _list = that.data.contentlist;
		  	if(scrolldirect == 'up'){
		  		var group = _res.contentlist.concat(_list);
		  	}else{
		  		var group = _list.concat(_res.contentlist);
		  	}
	
		   	that.setData({
		   		contentlist:group,
		   		hiddenLoading:true,
		   		currenttab:opt.channelId,
		   		channelName:opt.channelName
		   	})
		  }
		})
	},
 	scrolltolower:function(e){
 		var that = this;
 		var count = that.data.page;
 		count++;
 		that.setData({
 			page:count,
 			hiddenLoading:false,
 			scrolldirect:'down'
 		})
	 	that.getResource(({
	  		channelId:that.data.currenttab,
	  		channelName:that.data.channelName,
	  		page:count
	  	}));
 	},
 	tabTap:function(e){
 		var that = this;
 		var channelId = e.currentTarget.dataset.channelid;
 		var channelName = e.currentTarget.dataset.name;
		that.setData({
 			contentlist:[],
 			hiddenLoading:false
 		})
 		that.getResource(({
 			channelId:channelId,
 			channelName:channelName,
 			page:1
 		}));
 	},
 	redirectTodetail:function(e){
 		var _contentlist = this.data.contentlist;
 		var idx = e.currentTarget.dataset.index;
 		wx.setStorage({
 		  key:"content",
 		  data:_contentlist[idx].html,
 		  success: function(res) {
	 		wx.navigateTo({
	 		  url: '../detail/detail'
	 		})
 		  }
 		})
 	},
 	onPullDownRefresh:function(){
 		var that = this;
 		var count = that.data.page;
 		count++;
 		if(this.data.fresh){
 			this.setData({
 				scrolldirect:'up',
 				hiddenLoading:false,
 				page:count
 			})
		 	that.getResource(({
		  		channelId:that.data.currenttab,
		  		channelName:that.data.channelName,
		  		page:count
		  	}));
 		}
 		
 	},
 	scrollTap:function(e){
 		if(e.detail.offsetTop<10){
 			this.setData({
 				fresh:true
 			})
 		}else{
 			this.setData({
 				fresh:false
 			})
 		}
 	}
})		