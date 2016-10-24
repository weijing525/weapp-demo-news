Page({
	onLoad:function(options){
		
	},
	trimSpace:function(str){
	  /*去掉字符串中所有空格*/
	    var result;
	    result = str.replace(/(^\s+)|(\s+$)/g,"");
	    return result.replace(/\s/g,"");
	},
	onReady:function(){
		var that = this;
		wx.getStorage({
		  key: 'content',
		  success: function(res) {
		  	/*
				将接口中返回的标签(p,img,a,strong...)全部清空掉
		  	*/
		  	var _data = res.data.match(/<p>.*?<\/p>/g);
		  	var imgList = [];
		  	var result = [];
		  	for(var i = 0,len = _data.length;i<len;i++){
		  		imgList[i] = /<img.*?>/.test(_data[i]);
		  		var data = that.trimSpace(_data[i]);
		  		if(imgList[i]){
		  			_data[i] =  data.match( /(http:|https:).*?\.(jpg|jpeg|gif|png)/ );
		  			result.push({src:_data[i][0]})
		  		}else{
		  			var rs = data.replace( /<p>/g, '' )
		  							.replace( /<\/p>/g, '' )
			                        .replace( /<strong>/g, '' )
			                        .replace( /<\/strong>/g, '' )
			                        .replace( /<a.*?\/a>/g, '' )
			                        .replace( /&nbsp;/g, ' ' )
			                        .replace( /&ldquo;/g, '"' )
			                        .replace( /&rdquo;/g, '"' );
			       result.push({para:rs})
		  		}
		  	}
		  	that.setData({
		  		content:result
		  	})
		  }
		});
	},
	onShow:function(){
		
	},
	onHide:function(){
	},
	onUnload:function(){
		
	}
})		