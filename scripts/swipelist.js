function Swipelist(playlist){
    var list = playlist;
    var slider = list.containerDOM;
    var iter = playlist.iterator;
    var curentTranslate = 0;
    var pagging = null;
    (function mouseHandle(){
        slider.onmousedown = function(event){
            event.preventDefault();
            var startMousePos = event.pageX;
            document.onmousemove = function(event){
                event.preventDefault();
                if(event.pageX - startMousePos > list.DEFAULT_ITEM_WIDTH/2){
                    iter.currentPos ? swipe('left') : swipe('return');
                }else if(startMousePos - event.pageX > list.DEFAULT_ITEM_WIDTH/2){
                    (iter.currentPos>=0) ? swipe('right') : swipe('return');
                }else{
                    drag(startMousePos - event.pageX);
                }
            }
            document.onmouseup = function(event){
                if(Math.abs(startMousePos - event.pageX) < list.DEFAULT_ITEM_WIDTH/2){
                    swipe('return');
                }
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    })();
    (function touchHandle(){
        var startMousePos = 0;
        slider.addEventListener('touchstart',function(event){
            event = event.changedTouches[0];
            startMousePos = event.pageX;
        });
        slider.addEventListener('touchend',function(event){
            event = event.changedTouches[0];
            if(event.pageX - startMousePos > 50){
                swipe('left');
            }else if(startMousePos - event.pageX > 50){
                swipe('right');
            }
        });
    })();

    var drag = function(dist) {
        slider.style.webkitTransform = "translateX("+(curentTranslate-dist)+"px)";
        slider.style.transform = "translateX("+(curentTranslate-dist)+"px)";
    }

    var swipe = function(direction){
        if(direction === 'right'){
            if(list.blocks.length - (iter.currentPos + iter.config.iterWindow) < iter.config.iterWindow){
                list.initData.makeRequestJSONP();
            }
            iter.forward(iter.config.iterWindow);
        }else if(direction === 'left'){
            iter.backward(iter.config.iterWindow);
        }else if(direction === 'return'){
            iter.backward(0);
        }

        document.onmousemove = null;
        document.onmouseup = null;
        
        slider.style.transition = "all .5s";
        
        updateSlider();

        setTimeout(function(){
            slider.style.transition = "";
        },500);

        pagging.currentPageSelect();
    }.bind(this);

    var updateSlider = function(){
        curentTranslate = -iter.currentPos*list.blockWidth;
        slider.style.webkitTransform = "translateX("+(curentTranslate)+"px)";
        slider.style.transform = "translateX("+(curentTranslate)+"px)";
    }

    window.onresize = function(){
        list.updateOnResize();
        updateSlider();
    }
    this.moveOnPage = function(index){
        index *= list.itemsInBlock;
        iter.jumpTo(index);
        curentTranslate = -index*list.blockWidth;
        slider.style.transition = "all .5s";
        slider.style.webkitTransform = "translateX("+(curentTranslate)+"px)";
        slider.style.transform = "translateX("+(curentTranslate)+"px)";
        setTimeout(function(){
            slider.style.transition = "";
        },500);
        list.updateOnResize();
    }

    this.loadPagging = function(_pagging){
        pagging = _pagging;
    }

    this.returnSlider = function(){
        slider.style.webkitTransform = "translateX("+(0)+"px)";
        slider.style.transform = "translateX("+(0)+"px)";
    }
}