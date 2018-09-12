/**
 * Game 整个游戏类
 * @ctx 画笔
 * @bird 鸟的实例
 * @pipe 管子的实例
 * @land 地面（背景实例）
 * @mountain 山 （背景的实例）
 */
function Game(ctx, bird, pipe, land, mountain){
		this.ctx = ctx;
		this.bird = bird;
		this.pipeArr = [pipe];
		this.land = land;
		this.mountain = mountain;

		this.timer = null;

		this.iframe = 0;
		this.init();
}

//初始化方法
Game.prototype.init = function() {
		this.star();
		this.bindEvent();
}


//渲染山
Game.prototype.renderMountain = function(){
	//简化代码
	var img = this.mountain.img; 
	this.mountain.x -= this.mountain.step;
	if (this.mountain.x < - img.width) {
		this.mountain.x = 0;
	}

	this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);

}

//渲染地面
Game.prototype.renderLand = function(){
	//简化代码
	var img = this.land.img;
	this.land.x -= this.land.step;
	if(this.land.x < - img.width) {
		this.land.x = 0;
	}

	this.ctx.drawImage(img, this.land.x, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y);

}



//游戏开始
Game.prototype.star = function() {

	var me = this;
	this.timer = setInterval(function() {
		me.iframe++;

		me.clear();
		me.renderMountain();
		me.renderLand();
		me.renderBird();
		//控制翅膀煽动
		if (!(me.iframe % 10)) {
			me.bird.fly();
		}
		// 鸟下落
		me.bird.fallDown();

		if(!(me.iframe % 65)){
			me.createPipe();
		}

		me.movePIpe();
		me.clearPipe();
		me.renderPipe();
		me.renderPoints();
		me.renderPipePoints();
		me.checkBoom();

	}, 20)

}

//	清屏
Game.prototype.clear = function() {
	this.ctx.clearRect(0, 0, 360, 512);
}


//渲染鸟
Game.prototype.renderBird = function() {
	var img = this.bird.img;

	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);
	//旋转头
	var deg = this.bird.state === "D" ? this.bird.speed * Math.PI / 180 : -this.bird.speed * Math.PI / 180;
	this.ctx.rotate(deg);

	this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
	this.ctx.restore();

}

//点击事件
Game.prototype.bindEvent = function(){
	var me = this;
	this.ctx.canvas.onclick = function(){
		me.bird.goUp();
	}
}

//渲染管子
Game.prototype.renderPipe = function(){
	var me = this;
	//因为多根管子---循环渲染
	this.pipeArr.forEach(function(value, index) {
		
		// 上管子图片
		var img_up = value.pipe_up;
		// x
		var img_x = 0;
		// y
		var img_y = img_up.height - value.up_height;
		// w
		var img_w = img_up.width;
		// h
		var img_h = value.up_height;
		// x
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		// y
		var canvas_y = 0;
		// w
		var canvas_w = img_up.width;
		// h
		var canvas_h = img_h;
		// 绘制上管子
		me.ctx.drawImage(img_up, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);


		// 下管子的图片
		var down_img = value.pipe_down;
		// x
		var down_img_x = 0;
		// y
		var down_img_y = 0;
		// w
		var down_img_w = down_img.width;
		// h
		var down_img_h = 250 - value.up_height;
		// x
		var down_canvas_x = me.ctx.canvas.width - value.step * value.count;
		// y
		var down_canvas_y = img_h + 150;
		// w
		var down_canvas_w = img_w;
		// h
		var down_canvas_h = 250 - img_h;
		// 绘制下管子图片
		me.ctx.drawImage(down_img, down_img_x, down_img_y, down_img_w, down_img_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h);

	})
}

Game.prototype.movePIpe = function(){
	this.pipeArr.forEach(function(value, index) {
		value.count++;
	})
}

// 创建多根管子
Game.prototype.createPipe = function() {
	var pipe = this.pipeArr[0].createPipe();
	this.pipeArr.push(pipe);
}

// 移除管子
Game.prototype.clearPipe = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		var pipe = this.pipeArr[i];
		if (pipe.x - pipe.step * pipe.count < - pipe.pipe_up.width) {
			this.pipeArr.splice(i, 1);
			return;
		}
	}
}

// 绘制鸟在原始坐标系的四个点
Game.prototype.renderPoints = function() {
	// 获取鸟的图片
	// 绘制bird的四个点
	var bird_A = {
		x: -this.bird.img.width / 2 + 6 + this.bird.x,
		y: -this.bird.img.height / 2 + 10 + this.bird.y
	}

	var bird_B = {
		x: -this.bird.img.width / 2 + 6 + this.bird.img.width - 12 + this.bird.x,
		y: -this.bird.img.height / 2 + 10 + this.bird.y
	}

	var bird_C = {
		x: -this.bird.img.width / 2 + 6 +  this.bird.x,
		y: -this.bird.img.height / 2 + 10 + this.bird.img.height - 20 +  this.bird.y
	}

	var bird_D = {
		x: -this.bird.img.width / 2 + 6 + this.bird.img.width - 12 +  this.bird.x,
		y: -this.bird.img.height / 2 + 10 + this.bird.img.height - 20 +  this.bird.y
	}

	this.ctx.beginPath();
	this.ctx.moveTo(bird_A.x, bird_A.y);
	this.ctx.lineTo(bird_B.x, bird_B.y);
	this.ctx.lineTo(bird_D.x, bird_D.y);
	this.ctx.lineTo(bird_C.x, bird_C.y);
	this.ctx.closePath();
	this.ctx.strokeStyle = "blue";
	this.ctx.stroke();
}

// 绘制管子的8个点
Game.prototype.renderPipePoints = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		// 获取一根管子
		var pipe = this.pipeArr[i];

		// 绘制上管子的4个点
		var pipe_up_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}

		var pipe_up_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}

		var pipe_up_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe.up_height
		}

		var pipe_up_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}

		this.ctx.beginPath();
		this.ctx.moveTo(pipe_up_A.x, pipe_up_A.y);
		this.ctx.lineTo(pipe_up_B.x, pipe_up_B.y);
		this.ctx.lineTo(pipe_up_D.x, pipe_up_D.y);
		this.ctx.lineTo(pipe_up_C.x, pipe_up_C.y);
		this.ctx.closePath();
		this.ctx.strokeStyle = "red";
		this.ctx.stroke();


		// 绘制下管子的4个点
		var pipe_down_A = {
			x: pipe_up_A.x,
			y: pipe.up_height + 150
		}

		var pipe_down_B = {
			x: pipe_up_B.x,
			y: pipe_down_A.y
		}

		var pipe_down_C = {
			x: pipe_down_A.x,
			y: 400
		}

		var pipe_down_D = {
			x: pipe_down_B.x,
			y: 400
		}

		this.ctx.beginPath();
		this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
		this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
		this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
		this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
		this.ctx.closePath();
		this.ctx.strokeStyle = "red";
		this.ctx.stroke();
	}
}

// 检测小鸟与管子是否碰撞
Game.prototype.checkBoom = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		// 获取一根管子
		var pipe = this.pipeArr[i];

		// 绘制上管子的4个点
		var pipe_up_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}

		var pipe_up_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}

		var pipe_up_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe.up_height
		}

		var pipe_up_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}

		// 绘制下管子的4个点
		var pipe_down_A = {
			x: pipe_up_A.x,
			y: pipe.up_height + 150
		}

		var pipe_down_B = {
			x: pipe_up_B.x,
			y: pipe_down_A.y
		}

		var pipe_down_C = {
			x: pipe_down_A.x,
			y: 400
		}

		var pipe_down_D = {
			x: pipe_down_B.x,
			y: 400
		}

		// 鸟四个点
		var bird_A = {
			x: -this.bird.img.width / 2 + 6 + this.bird.x,
			y: -this.bird.img.height / 2 + 10 + this.bird.y
		}

		var bird_B = {
			x: -this.bird.img.width / 2 + 6 + this.bird.img.width - 12 + this.bird.x,
			y: -this.bird.img.height / 2 + 10 + this.bird.y
		}

		var bird_C = {
			x: -this.bird.img.width / 2 + 6 +  this.bird.x,
			y: -this.bird.img.height / 2 + 10 + this.bird.img.height - 20 +  this.bird.y
		}

		var bird_D = {
			x: -this.bird.img.width / 2 + 6 + this.bird.img.width - 12 +  this.bird.x,
			y: -this.bird.img.height / 2 + 10 + this.bird.img.height - 20 +  this.bird.y
		}


		// 碰撞检测
		// 鸟的B点和上管子的C点
		if (bird_B.x >= pipe_up_C.x && bird_B.y <= pipe_up_C.y && bird_A.x <= pipe_up_B.x) {
			console.log("撞到上管子了");
			this.gameOver();
			return;
		}

		// 鸟的D点和下管子的A点
		if (bird_D.x >= pipe_down_A.x && bird_D.y >= pipe_down_A.y && bird_C.x <= pipe_down_B.x) {
			console.log("撞到下管子了");
			this.gameOver();
			return;
		}
	}
}

// 游戏结束
Game.prototype.gameOver = function() {
	clearInterval(this.timer);
} 