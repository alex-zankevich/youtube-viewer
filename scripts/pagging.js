function Pagging(playlist,swipelist){

    var ITEM_WIDTH = 30;
    var playlist = playlist;
    var swipelist = swipelist;
    var translate = 0;
    var timer = null;
    var pageItems = null;
    var itemsCount = null;

    var initPageContainer = function(){
        document.querySelector('footer').innerHTML = '';
        var wrap = document.createElement('div');
        wrap.innerHTML = '<div class="pagging"></div>';
        var page = wrap.firstChild;
        document.querySelector('footer').appendChild(page);
        return page;
    }

    var countItems = function(){
        return Math.ceil(playlist.blocks.length/playlist.itemsInBlock);
    }

    pageItems = initPageContainer();
    itemsCount = countItems();

    var createPageItem = function(){
        var wrap = document.createElement('div');
        wrap.innerHTML = '<div class="page"><div class="page-index"></div></div>';
        var page = wrap.firstChild;
        pageItems.appendChild(page);
        page.firstChild.innerHTML = '<span>'+(findChildIndex(page)+1)+'</span>';
        return page;
    }

    this.updatePagging = function(){
        itemsCount = countItems();
        pageItems.style.width = ITEM_WIDTH*itemsCount + 'px';
        pageItems.innerHTML = '';
        for(var i = 0; i < itemsCount;i++){
            createPageItem().addEventListener('click',function(event){
                var element = event.target;
                var index = findChildIndex(element);
                swipelist.moveOnPage(index);
            });
        }
        this.currentPageSelect();
    }

    this.currentPageSelect = function(){
        if(pageItems.childNodes.length){
            var prev = document.querySelector('.selected');
            if(prev){
                prev.classList.remove('selected');
            }
            var current = playlist.iterator.currentPos;
            current = Math.floor(current/playlist.itemsInBlock);
            var select = '.page:nth-child('+(current+1)+')';
            var curElement = document.querySelector(select);
            if(curElement){
                curElement.classList.add('selected');
            }
        }
    }

    var findChildIndex = function(node) {
        var index = 0;
        while (node.previousSibling) {
            node = node.previousSibling;
            if (node && node.nodeType === 1) {
                ++index;
            }
        }
        return index;
    }

    var move = function(dist){
        translate -= dist;
        pageItems.style.webkitTransform = "translateX("+(translate)+"px)";
        pageItems.style.transform = "translateX("+(translate)+"px)";
    };

    var returnPagging = function(){
        pageItems.style.transition = "all .5s";
        move(translate);
        setTimeout(function(){
            pageItems.style.transition = "";
        },500);
    }
    
    document.querySelector('footer').onmouseout = function(event){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(returnPagging, 3000);
    };

    (function mouseHandle(){
        pageItems.onmousedown = function(event){
            event.preventDefault();
            var startMousePos = event.pageX;
            document.onmousemove = function(event){
                event.preventDefault();
                if(event.pageX > window.innerWidth/5 && event.pageX < 4*window.innerWidth/5){
                    move(startMousePos - event.pageX);
                }
                startMousePos = event.pageX;
            }
            document.onmouseup = function(event){
                document.onmousemove = null;
            }
        }
    })();
}