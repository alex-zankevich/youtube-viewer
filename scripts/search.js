function Initializer(playlist, search){
	var nextPage = "";
	var clipList = [];
	var search = search;
	var list = playlist;
	var MAX_RESULT = 15;

	this.getCliplist = function (data){
		var items = data.items;
		var clipList = [];
		if(items.length){
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				var itemSnippet = item.snippet;
				var shortId = item.id.videoId;
				var date = new Date(itemSnippet.publishedAt);
				clipList.push({
					id: shortId,
					youtubeLink: "http://www.youtube.com/watch?v=" + shortId,
					title: itemSnippet.title,
					thumbnail: itemSnippet.thumbnails.medium.url,
					description: itemSnippet.description,
					publishDate: date.toUTCString(),
					channelTitle: itemSnippet.channelTitle
				});
			}
		}
		return clipList;
	}

	var makeStatisticsRequest = function(cliplist){
		var req = [];
		for(var i = 0; i < cliplist.length; i++){
			if(typeof cliplist[i].id !== 'undefined'){
				req.push(cliplist[i].id);
			}else{
				req.push("H6G63NKRSi8");
			}
		}
		req = req.join('%2C');
		req = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id="+req+"&key=AIzaSyAVbKSjxPh3SuXlOJJY4yHTCujjhuxoCjY"
		return req;
	}
	var updateClipList = function(response, cliplist){
		var items = response.items;
		for(var i = 0; i < items.length; i++){
			var temp = items[i].statistics;
			cliplist[i].viewCount = temp.viewCount;
			cliplist[i].likeCount = temp.likeCount;
			cliplist[i].dislikeCount = temp.dislikeCount;
		}
	}

	this.makeRequestJSONP = function(){
		list.updateOnResize();
		list.loader.start();
		search = search.trim().split(/\s/g).join('+');
		
		var request = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+search;
		if(nextPage){
			request = request+"&type=video&pageToken="+nextPage;
		}
		request = request + "&maxResults="+MAX_RESULT+"&key=AIzaSyAVbKSjxPh3SuXlOJJY4yHTCujjhuxoCjY"
		
		var getClips = this.getCliplist;

		scriptRequest(request,function(resp){
			var response = resp;
			nextPage = response.nextPageToken;
			clipList = getClips(response);
			setTimeout(function(){
				scriptRequest(makeStatisticsRequest(clipList),function(response){
					list.loader.stop();
					updateClipList(response,clipList);
					for(var i = 0; i < clipList.length; i++){
						list.addBlock(clipList[i]);
					}
					list.updateOnResize();
				}.bind(this),function(url){
					console.log("Error on request : " + url);
					return false;
				});
			},500);
		},function(url){
			console.log("Error on request : " + url);
			return false;
		});
	}
}