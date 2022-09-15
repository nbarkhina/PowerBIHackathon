import { Assets } from './assets';

export class Ball{
	x:number = 10;
	y:number = 20;
    color:string = '';
    name:string = '';
	radius:number = 40;
	xMove:number = 3;
	yMove:number = 5;
	xBoundary:number = 0;
	yBoundary:number = 0;
	ctx:CanvasRenderingContext2D;
	constructor(xBoundary:number,yBoundary:number,ctx:CanvasRenderingContext2D,name:string,color:string){
		this.x = Math.floor(Math.random() * 100) + this.radius;
		this.y = Math.floor(Math.random() * 100) + this.radius;
		this.xMove = Math.floor(Math.random() * 10)+1;
		this.yMove = Math.floor(Math.random() * 10)+1;
		this.xBoundary = xBoundary;
		this.yBoundary = yBoundary;
		this.ctx = ctx;
        this.name = name;
        this.color = color;
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
		this.ctx.fillStyle = this.color;
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

export class Coordinate{
    constructor(public x:number, public y:number){}
}

export class Sprite{

    constructor(
        public image:HTMLImageElement,
        public x:number, 
        public y:number,
        public width:number, 
        public height:number,
        public ctx:CanvasRenderingContext2D){}

    //draws sprite from top left corner, not from sprite center point
    draw(x:number,y:number,width?:number){
        if (width){
            let ratio = width/this.width;
            this.ctx.drawImage(this.image,
                this.x,this.y,this.width,this.height, //source
                x,y,this.width * ratio,this.height * ratio); //destination
        }
        else
        {
            this.ctx.drawImage(this.image,
                this.x,this.y,this.width,this.height, //source
                x,y,this.width,this.height); //destination
        }
    }

    drawAndRotate(x: number, y: number, rotation: number, width?: number) {

        if (width){
            let ratio = width / this.width;
            let newWidth = this.width * ratio;
            let newHeight = this.height * ratio;

            let angleInRadians = rotation * Math.PI / 180;
            this.ctx.save();
            this.ctx.translate(x + newWidth/2, y + newHeight/2);
            this.ctx.rotate(angleInRadians);

            this.ctx.drawImage(this.image,
                this.x, this.y, this.width, this.height, //source
                -newWidth/2, -newHeight/2, newWidth, newHeight); //destination
        }
        else
        {
            let angleInRadians = rotation * Math.PI / 180;
            this.ctx.save();
            this.ctx.translate(x + this.width/2, y + this.height/2);
            this.ctx.rotate(angleInRadians);

            this.ctx.drawImage(this.image,
                this.x, this.y, this.width, this.height, //source
                -this.width/2, -this.height/2, this.width, this.height); //destination
        }
        

        this.ctx.restore();


    }

}

export class MyApp{

	ctx:CanvasRenderingContext2D;
	canvas:HTMLCanvasElement;
	balls:Ball[] = [];
    spriteSheet:HTMLImageElement;
    assetsLoaded:boolean = false;
    mario:Sprite;
    angle = 0;
    mouseBall:Ball;

	constructor(canvas){
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.addBall('');

        //start it offscreen
        this.mouseBall = new Ball(0, 0, this.ctx, '',this.randomColor());
        this.mouseBall.x = -100;
        this.mouseBall.y = -100;

        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this))
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this))

		window.requestAnimationFrame(this.draw.bind(this));

	}

    //load all data here
    async loadData(){
		try
		{
			this.spriteSheet = await this.loadImage();

			this.mario = new Sprite(this.spriteSheet,0,0,137,216,this.ctx);
	
			this.assetsLoaded = true;
		}catch(error){
			console.log('error in loadData', error);
		}

    }

    loadImage(){
		// let img: HTMLImageElement = document.createElement("img");

        return new Promise<HTMLImageElement>((resolve, reject) => {
            let img = new Image();
            img.src = Assets.spritesheet;
            img.onload = () => resolve(img)
            img.onerror = reject
        });
    }

    addBall(name:string){
		this.balls.push(new Ball(this.canvas.width, this.canvas.height, this.ctx, name, 'green'));
    }

    convertMouseCoordinates(event:MouseEvent):Coordinate{
        //convert to local coordinates
        let rect = this.canvas.getBoundingClientRect()
		let canvasX = event.clientX - rect.left;
		let canvasY = event.clientY - rect.top;
        let scale = this.canvas.width / rect.width;
        let pixelX = canvasX * scale;
        let pixelY = canvasY * scale;

		// console.log(canvasX, canvasY, pixelX, pixelY, scale);

        return new Coordinate(pixelX, pixelY);
    }

	mouseMove(event:MouseEvent) { 
        let location = this.convertMouseCoordinates(event);

        this.mouseBall.x = location.x;
        this.mouseBall.y = location.y;
    }

    randomColor():string{
        return "#" + Math.floor(Math.random()*16777215).toString(16);
    }

	
	mouseDown(event:MouseEvent) { 
        this.mouseBall.color = this.randomColor();
	}

    updateData(data:string[]){

        if (data.length != this.balls.length)
        {
            this.balls = [];

            data.forEach(name => {
                this.addBall(name);
            });
        }

    }

    drawLine(x: number, y: number, x2: number, y2: number) {
        // set line color
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

	draw(){
		
        if (this.assetsLoaded)
        {
            this.ctx.fillStyle = "lightblue";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    
            this.angle++;

            this.balls.forEach(ball => {
                ball.move();
                ball.draw();

                let width = 50;
                let xoffset = width/2;
                let yoffset = (xoffset/this.mario.width)*this.mario.height;

                if (ball.name=='Microsoft')
                    this.mario.draw(ball.x-xoffset,ball.y-yoffset,width);
                else
                    this.mario.drawAndRotate(ball.x-xoffset,ball.y-yoffset,this.angle,width);
            });

            this.mouseBall.draw();

        }
		

		window.requestAnimationFrame(this.draw.bind(this));
		
	}


    //for debugging rotation
    debugRotation(){
        
        let x = 300;
        let y = 300;

        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
        this.ctx.fill();


        let width = 100;
        let height = this.mario.height * (width/this.mario.width);
        let x2 = x + width;
        let y2 = y + height;
        this.drawLine(x,y,x,y2);
        this.drawLine(x,y,x2,y);
        this.drawLine(x2,y,x2,y2);
        this.drawLine(x,y2,x2,y2);
        this.mario.draw(x,y,width);

        
        this.mario.drawAndRotate(300,300,this.angle,100)

        this.mario.draw(100,100);
        this.mario.drawAndRotate(100,100,this.angle)
        
    }


	
}