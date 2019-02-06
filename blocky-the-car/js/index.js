var canvas = document.getElementById("art");
var ctx = canvas.getContext("2d");

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setupCanvas();
window.onresize = function() {
  setupCanvas();
};

var iso = new Isomer(document.getElementById("art"));
var Shape = Isomer.Shape;
var Point = Isomer.Point;
var Color = Isomer.Color;
var Path = Isomer.Path;

//___________________get keyboard input___________________
const keys = [];
document.onkeydown = function(e) {
  keys[e.keyCode] = true;
};
document.onkeyup = function(e) {
  keys[e.keyCode] = false;
};

document.body.style.backgroundColor = "#a1dfa5";


let road = {
	clr: new Color (60,60,75),
	track: {
		clr: new Color(80,80,20),
	},
}

let car = {
	pos: {
		x: 3.75,
		y: 0,
		h: .5,
	},
	siz: {
		w: 1,
		l: 2,
	},
	clr: new Color(90,30,15),
	whl: {
		clr: new Color (25,24,20),
	},
	draw: function() {
		iso.add(Shape.Prism(new Point(car.pos.y, car.pos.x, 0),
							car.siz.l, car.siz.w, car.siz.h), car.clr);
		// let whl = Shape.Cylinder(new (Point(car.pos.y - car.siz.w/1.5,
		// 						  car.pos.x + car.siz.w/2, 0), .2, 3, .2), car.whl.clr);
		// 						 iso.add(whl
		// 						 .rotateZ(Point(1.5, 1.5, 0), Math.PI / 12) .translate(0, 0, 1.1))
								 
	},
}

class Cone {
	constructor(posX, w, h, clr = coneOrange) {
		this.posX = posX;
		this.posY = posX + 8;
		this.w = w;
		this.h = h;
		this.clr = clr;
	};
	draw() {
		iso.add(Shape.Prism(Point(this.posY, this.posX, 2),
					    this.w, this.w, this.h/7), this.clr);
		iso.add(Shape.Pyramid(Point(this.posY + this.w*.1, this.posX +
									this.w * .1, 2 + this.h/7),
							  this.w*.8, this.w*.8, this.h), this.clr);
	};
	updt(vel) {
		this.posY += vel;
	};
};
class Pers { // pedestrians
	constructor(posX, w, h, drk) {
		this.posX = posX;
		this.posY = posX + 8;
		this.w = w;
		this.h = h;
		this.clr = new Color(skinColor.r/drk, skinColor.g/drk, skinColor.b/drk);
		this.dir = rand()*1.5 - .75;
	};
	draw() {
		iso.add(Shape.Cylinder(Point(this.posY + this.w/2, this.posX + this.w*1.5/5, 2),
							  this.w/17, 30, this.h*.2), this.clr);
		iso.add(Shape.Cylinder(Point(this.posY + this.w/2, this.posX + this.w*3.5/5, 2),
							  this.w/17, 30, this.h*.2), this.clr);
		iso.add(Shape.Prism(Point(this.posY + this.w/5, this.posX + this.w/5, 2 + this.h*.2),
							this.w*3/5, this.w*3/5, this.h*.25), this.clr);
		iso.add(Shape.Cylinder(Point(this.posY + this.w/5 + this.w*3.5/10 , this.posX + this.w/5, this.h*.2 + 2),
							  this.w/17, 30, this.h*.5/3), this.clr);
		iso.add(Shape.Prism(Point(this.posY + this.w*.35,
								  this.posX + this.w*.35,
								  2 + this.h*.45),
					    this.w*.3, this.w*.3, this.h*.15), new Color(60,60,65));
		iso.add(Shape.Prism(Point(this.posY + this.w*.35,
								  this.posX + this.w*.35,
								  2 + this.h*.4725),
					    this.w*.35, this.w*.35, this.h*.15), this.clr);
	};
	updt(vel) {
		this.posY += vel
		if (this.posX >= 5.5 - this.w)
			this.dir = Math.abs(this.dir);
		if (this.posX <= -0.5 - this.w)
			this.dir = -Math.abs(this.dir);
		this.posX += vel*2 * this.dir;
	};
};

function drawClass(arr) {
	for (let obj = arr.length - 1; obj >= 0 ; obj--) {
		arr[obj].draw();
		if (car.pos.x < arr[obj].posX + arr[obj].w + 2 &&
			car.pos.y <= arr[obj].posY + arr[obj].w + 2 &&
			car.pos.y + car.siz.l >= arr[obj].posY)
			car.draw();
	}
}

function updtClass(arr) {
	for (let obj = 0; obj < arr.length; obj++) {
		if (arr[obj].posY <= arr[obj].posX -8) {
			arr.splice(obj, 1);
		}
		arr[obj].updt(mps); // check for crash
		if (car.pos.x < arr[obj].posX + arr[obj].w + 2 &&
			car.pos.x + car.siz.w > arr[obj].posX + 2 &&
			car.pos.y <= arr[obj].posY + arr[obj].w + 2 &&
			car.pos.y + car.siz.l >= arr[obj].posY + 2
		   ) {
			mps = 0; // CRASH!
		}
	}
}

const coneOrange = new Color(200, 110, 20);
const skinColor = new Color(210, 165, 60);

let rand = Math.random;
let enems = [];
let enemFreq = 90;
let enemTimer = 0;
let dist = 0; // distance travelled
let mps = -.09; // rate of change of distance;
let acc = .001; // rate of change of rate of change of distance;
let secs = 0;

////////////////////////// CYCLE /////////////////////////////
function cycle() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	car.siz.h = .35 + .15 * Math.abs(Math.cos(dist));
	
	if (mps != 0) {
		mps = 20/(secs/60 + 150) - .2;
		dist += mps;

		if (keys[65] || keys[37]) { // left (a)
			if (car.pos.x < 6.4499999999999999)
				car.pos.x += .15;
			else
				car.pos.x = 6.5;
		}
		if (keys[68] || keys[39]) { // right (d)
			if (car.pos.x > .65000000000000010)
				car.pos.x -= .15;
			else
				car.pos.x = .5;
		}
	
		enemFreq = Math.floor(90/(secs/270 + 1) + 45)
		if (secs >= enemTimer) {
			let enemType = Math.ceil(rand()*2);
			switch (enemType) {
				case 0:
				case 1:
					enems.push(new Cone(rand()*6 - 1.5, 1, 1 + rand()));
					break;
				case 2:
					enems.push(new Pers(rand()*6 - 1.5, 1, 2, rand()*1.5 + 1));
					break;
			}
			enemTimer = secs + enemFreq;
		}
	}
	
	// draw road
	iso.add(Shape.Prism(new Point(-10, 0, 0), 40, 7, .5), road.clr);
	for (i = 0; i <= 20; i++)
		iso.add(Shape.Prism(new Point(i * 4.5 + dist % 4.5 - 10, 4, 0),
					  1.5, .5, 0), road.track.clr);
		
	car.draw();
	updtClass(enems);
	drawClass(enems);
	
	
	ctx.font = canvas.width/30 + "px Courier";
	ctx.fillText("Distance: " + Math.abs(dist).toFixed(1) + "m", 10, canvas.width/20);
	ctx.fillText("Speed: " + Math.abs(mps*10).toFixed(3) + "mps", 10, canvas.width/11.5);
	
	secs += 1;
	
	requestAnimationFrame(cycle);
}
requestAnimationFrame(cycle);

// iso.add(Shape.Prism(new Point(0, 0, -.1), 50, 7.4, 0.1), new Color(20, 10, 50));