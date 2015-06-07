function Playlist(){
    this.DEFAULT_ITEM_WIDTH = 300;
    this.CONTAINER = '.container';
    this.BLOCK = '.block';
    this.winWidth = window.innerWidth;
    this.blockWidth = 0;
    this.itemsInBlock = 0;
    this.blocks = [];
    this.iterator = new Iterator(this.blocks);
    this.blockDOM = null;
    this.containerDOM = document.querySelector(this.CONTAINER);
    this.initData = null;
    this.loader = null;
    this.pagging = null;
}

Playlist.prototype.addBlock = function(data) {
    var newBlock = new Block(data);
    this.blocks.push(newBlock);
    this.containerDOM.appendChild(newBlock.item);
};

Playlist.prototype.changeDefaultCount = function(count){
    this.blockWidth = parseInt(this.winWidth/count,10);
    [].forEach.call(this.blockDOM,function(element){
        element.style.width = this.blockWidth + 'px';
    }.bind(this));
}

Playlist.prototype.countItemInBlock = function(){
    return parseInt(window.innerWidth/this.DEFAULT_ITEM_WIDTH,10);
}

Playlist.prototype.initDependencies = function(init, loader, pagging) {
    this.initData = init;
    this.loader = loader;
    this.pagging = pagging;
};

Playlist.prototype.updateOnResize = function(){
    if(window.innerWidth > this.DEFAULT_ITEM_WIDTH){
        this.winWidth = window.innerWidth;
        this.blockDOM = document.querySelectorAll(this.BLOCK);
        this.itemsInBlock = this.countItemInBlock();
        this.changeDefaultCount(this.itemsInBlock);
        this.containerDOM.style.width = (this.blockWidth*this.blocks.length+this.DEFAULT_ITEM_WIDTH*this.itemsInBlock) + 'px';
        this.iterator.config.iterWindow = this.itemsInBlock;
        this.pagging.updatePagging();
    }
};

function Block(data){
    var createBlockItem = function(data) {
        var wrap = document.createElement('div');
        wrap.innerHTML =    '<div class="block">\
            <div class="item">\
                <div class="img">\
                    <p id="title"><a href='+data.youtubeLink+' target="_blank">'+data.title+'</a></p>\
                    <p id="channel"><a href='+data.youtubeLink+' target="_blank">'+data.channelTitle.toUpperCase()+'</a></p>\
                    <a href='+data.youtubeLink+' target="_blank"><img src="'+data.thumbnail+'"></a>\
                </div>\
                <div class="description">\
                    <p>Description:</p><p>'+data.description+'</p>\
                    <p>Date: '+data.publishDate+'</p>\
                </div>\
                <div class="more">\
                    <div class="info views"><p>'+data.viewCount+' views</p></div>\
                    <div class="info likes"><p>'+data.likeCount+' likes</p></div>\
                    <div class="info dislikes"><p>'+data.dislikeCount+' dislikes</p></div>\
                </div>\
            </div>\
        </div>';
        return wrap.firstChild;
    };
    this.item = createBlockItem(data);
    this.data = data;
}