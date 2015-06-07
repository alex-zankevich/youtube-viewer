(function(){

	document.querySelector('body').innerHTML = '<header><input type="text" id="search"></header><main><div class="wrapper"><div class="container"></div></div></main><footer></footer>';
	
	var preloader = new Preloader();
	preloader.start();
	
	var search = document.querySelector('#search');
	var slider = document.querySelector('.container');
	var searchResult = "";
	
	search.addEventListener('keypress', function(event){
		if(event.keyCode === 13){
			slider.innerHTML = '';
			searchResult = search.value;
			search.blur();
			run(searchResult);
		}
	});

	function run(search){
		var playList = new Playlist();
		var swipeList = new Swipelist(playList);
		var pagging = new Pagging(playList,swipeList);
		var dataInit = new Initializer(playList, searchResult);
		swipeList.loadPagging(pagging);
		swipeList.returnSlider();
		playList.initDependencies(dataInit,preloader,pagging);
		dataInit.makeRequestJSONP();
	}
})();