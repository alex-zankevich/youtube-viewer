function Iterator(array,config){
	if(typeof array === 'undefined' || Object.prototype.toString.call(array) !== '[object Array]'){
		throw new Error();
	}
	this.array = array;
	this.currentPos = 0;
	if( typeof config !== 'undefined' ){
		this.config = config;
	}else{
		this.config = {
			iterWindow: 1,
			cycling: false,
			posFunction: function(_start,_end){
				return {
					start:_start,
					end: _end
				}
			}
		};
	}
	if(array.length && this.config.iterWindow > array.length){
		this.config.iterWindow = array.length;
	}
	this.currentVal = array.slice(0,this.config.iterWindow);
	return this;
};
Iterator.prototype.jumpTo = function(pos) {
	if(typeof pos === 'undefined' || isNaN(+pos) || +pos % 1 != 0){
		throw new Error();
	}
	if(!this.array.length){
		throw new Error();
	}
	this.currentVal = [];
	if(this.config.cycling){
		pos %= this.array.length;
		if(pos < 0){
			pos = this.array.length + pos;
		}
		this.currentPos = pos;
		for(var i = 0; i < this.config.iterWindow; i++){
			if(pos === this.array.length){
				pos = 0;
			}
			this.currentVal.push(this.array[pos++]);
		}
	}else{
		if(pos < 0){
			this.currentPos = 0;
		}else{
			this.currentPos = pos;
			for(var i = 0; i < this.config.iterWindow;i++){
				if(pos === this.array.length){
					break;
				}
				this.currentVal.push(this.array[pos++]);
			}
		}
	}
};
Iterator.prototype.current = function() {
	return this.currentVal;
};
Iterator.prototype.forward = function(n) {
	if(n >= 0){
		this.jumpTo(this.currentPos + n);
		return this.currentVal;
	}else{
		throw new Error();
	}
};
Iterator.prototype.backward = function(n) {
	if(n >= 0){
		this.jumpTo(this.currentPos - n);
		return this.currentVal;
	}else{
		throw new Error();
	}
};