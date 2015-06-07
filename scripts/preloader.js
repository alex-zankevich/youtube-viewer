function Preloader(){
	var wrap = document.createElement('div');
    wrap.innerHTML = '<div class="spinner"></div>';
    this.loader = wrap.firstChild;
    
    document.querySelector('body').appendChild(this.loader);
    this.loader.style.display = 'none';

    var wrapper = document.querySelector('.wrapper');
    this.start = function(){
    	wrapper.style.opacity = '.5';
    	this.loader.style.display = 'block';
    }
    this.stop = function(){
    	wrapper.style.opacity = '1';
    	this.loader.style.display = 'none';
    }
}