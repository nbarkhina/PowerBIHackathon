export class Ball{
	x:number = 10;
	y:number = 20;
    name:string = '';
	radius:number = 40;
	xMove:number = 3;
	yMove:number = 5;
	xBoundary:number = 0;
	yBoundary:number = 0;
	ctx:CanvasRenderingContext2D;
	constructor(xBoundary:number,yBoundary:number,ctx:CanvasRenderingContext2D,name:string){
		this.x = Math.floor(Math.random() * 100) + this.radius;
		this.y = Math.floor(Math.random() * 100) + this.radius;
		this.xMove = Math.floor(Math.random() * 10)+1;
		this.yMove = Math.floor(Math.random() * 10)+1;
		this.xBoundary = xBoundary;
		this.yBoundary = yBoundary;
		this.ctx = ctx;
        this.name = name;
	}

	move(){
		this.x += this.xMove;
		this.y += this.yMove;
		if (this.x>this.xBoundary-this.radius || this.x-this.radius<0)
			this.xMove=this.xMove*-1;
		if (this.y>this.yBoundary-this.radius|| this.y-this.radius<0)
			this.yMove=this.yMove*-1;
	}

	draw(){
		this.ctx.fillStyle = "green";
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		this.ctx.fill();

        this.ctx.font = "30px Arial";
		this.ctx.fillStyle = "red";
        if (this.name)
        {
            this.ctx.fillText(this.name, this.x, this.y);
        }
	}
}


export class MyApp{

	ctx:CanvasRenderingContext2D;
	canvas:HTMLCanvasElement;
	balls:Ball[] = [];

	constructor(canvas){
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.addBall('');
		window.requestAnimationFrame(this.draw.bind(this));

        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this,event))
	}

    addBall(name:string){
		this.balls.push(new Ball(this.canvas.width, this.canvas.height, this.ctx,name));
    }

	
	mouseDown(event) {
		const rect = this.canvas.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top
		console.log("x: " + x + " y: " + y, event);

        this.addBall('');
	}

    updateData(data:string[]){
        this.balls = [];

        data.forEach(name => {
            this.addBall(name);
        });

    }

	draw(){
		
		this.ctx.fillStyle = "lightblue";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


		this.balls.forEach(ball => {
			ball.move();
			ball.draw();
		});

		window.requestAnimationFrame(this.draw.bind(this));
		
	}


	
}
