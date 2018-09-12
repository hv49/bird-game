function Bird(imgArr, x, y){
	//图片数组
	this.imgArr = imgArr;
	//定义图片索引
	this.idx = parseInt(Math.random() * imgArr.length);
	this.img = this.imgArr[this.idx];
	//平移坐标系
	this.x = x;
	this.y = y;
	this.state = "D";
	this.speed = 0;
}

//动翅膀
Bird.prototype.fly = function(){
	this.idx++;
	if(this.idx >= this.imgArr.length){
		this.idx = 0;

	}
	this.img = this.imgArr[this.idx];
}

Bird.prototype.fallDown = function(){
	//下降
	if(this.state === "D"){
		this.speed++;
		this.y += Math.sqrt(this.speed);
	}else{
		this.speed--;
		if(this.speed === 0){
			this.state = "D";
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
	
}

Bird.prototype.goUp = function(){
	this.state = "U";
	this.speed = 20;
}
