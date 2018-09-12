function Pipe(pipe_up, pipe_down, step, x){
	// 上图片
	this.pipe_up = pipe_up;
	// 下图片
	this.pipe_down = pipe_down;
	//上管子的高度
	this.up_height = parseInt(Math.random() * 249) + 1;
	//下管子的高度
	this.down_height = 250 - this.up_height;
	this.step = step;
	this.x = x;

	this.count = 0;
}

// 创建管子
Pipe.prototype.createPipe = function() {
	return new Pipe(this.pipe_up, this.pipe_down, this.step, this.x);
}