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

export class Cube{
	xBoundary:number = 0;
	yBoundary:number = 0;
	ctx:CanvasRenderingContext2D;
	lines:number[][] = [];
	radians_converter:number = Math.PI / 180.0;

	//camera position
	camx = 0;
	camy = 0;
	camz = -50;
	
	//center of cube
	centX = 0; 
	centY = 0;
	centZ = 150;

	constructor(xBoundary:number,yBoundary:number,ctx:CanvasRenderingContext2D){
		this.xBoundary = xBoundary;
		this.yBoundary = yBoundary;
		this.ctx = ctx;
		this.lines.push([-50.0,50.0,100.0,-50.0,50.0,200.0]);
		this.lines.push([50.0, 50.0, 100.0, 50.0, 50.0, 200.0]);
		this.lines.push([-50.0, -50.0, 100.0, -50.0, -50.0, 200.0]);
		this.lines.push([-50.0, -50.0, 100.0, 50.0, -50.0, 100.0]);
		this.lines.push([-50.0, 50.0, 100.0, 50.0, 50.0, 100.0]);
		this.lines.push([-50.0, 50.0, 200.0, 50.0, 50.0, 200.0]);
		this.lines.push([50.0, -50.0, 100.0, 50.0, -50.0, 200.0]);
		this.lines.push([-50.0, -50.0, 200.0, 50.0, -50.0, 200.0]);
		this.lines.push([-50.0, 50.0, 100.0, -50.0, -50.0, 100.0]);
		this.lines.push([50.0, 50.0, 100.0, 50.0, -50.0, 100.0]);
		this.lines.push([-50.0, 50.0, 200.0, -50.0, -50.0, 200.0]);
		this.lines.push([50.0, 50.0, 200.0, 50.0, -50.0, 200.0]);
		
	}

	move(){
		this.rotateY(-1);
	}

	rotateY(degrees:number)
	{
		let cosine = Math.cos(degrees*this.radians_converter);
		let sine = Math.sin(degrees*this.radians_converter);
		for (let i = 0; i < this.lines.length; i++)
		{
			let x = this.lines[i][0] - this.centX;
			let z = this.lines[i][2] - this.centZ;
			let newX = (x * cosine) + (z * sine);
			let newZ = (-x * sine) + (z * cosine);
			this.lines[i][0] = newX + this.centX;
			this.lines[i][2] = newZ + this.centZ;
			x = this.lines[i][3] - this.centX;
			z = this.lines[i][5] - this.centZ;
			newX = (x * cosine) + (z * sine);
			newZ = (-x * sine) + (z * cosine);
			this.lines[i][3] = newX + this.centX;
			this.lines[i][5] = newZ + this.centZ;
		}
	}

	draw(){
		this.lines.forEach(line => {
			this.line3d(line[0],line[1],line[2],line[3],line[4],line[5],'red');
		})

	}

	line3d(x1:number, y1:number, z1:number, x2:number, y2:number,z2:number, color:string)
	{
		if (z1 < 1 || z2 < 1)
			return;

		x1 = x1 - this.camx;
		x2 = x2 - this.camx;
		y1 = y1 - this.camy;
		y2 = y2 - this.camy;
		z1 = z1 - this.camz;
		z2 = z2 - this.camz;
		
		let newX1:number;
		let newY1:number;
		let newX2:number;
		let newY2: number;
		newX1 = ((x1 * 256) / z1) + (this.xBoundary / 2);
		newX2 = ((x2 * 256) / z2) + (this.xBoundary/ 2);
		newY1 = ((-y1 * 256) / z1) + (this.yBoundary / 2);
		newY2 = ((-y2 * 256) / z2) + (this.yBoundary / 2);

		this.drawLine(newX1,newY1,newX2,newY2,color);

	}

	drawLine(x1:number,y1:number,x2:number,y2:number,color:string){
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();       // Start a new path
		this.ctx.moveTo(x1, y1);    // Move the pen to (30, 50)
		this.ctx.lineTo(x2, y2);  // Draw a line to (150, 100)
		this.ctx.stroke();          // Render the path
	}
}

export class MyApp{

	ctx:CanvasRenderingContext2D;
	canvas:HTMLCanvasElement;
	balls:Ball[] = [];
	cube:Cube;

	constructor(canvas){
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.addBall('');
        this.cube = new Cube(this.canvas.width, this.canvas.height,this.ctx);
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

		// this.cube.move();
		// this.cube.draw();

		this.balls.forEach(ball => {
			ball.move();
			ball.draw();
		});

		window.requestAnimationFrame(this.draw.bind(this));
		
	}


	
}
