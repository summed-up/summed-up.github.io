function blockyTheCar() {
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

	//////////////////// get keyboard input ///////////////////
	const keys = [];
	document.onkeydown = function(e) {
	  keys[e.keyCode] = true;
	};
	document.onkeyup = function(e) {
	  keys[e.keyCode] = false;
	};

	document.body.style.backgroundColor = "#a1dfa5";

	/////////////////////// mouse input //////////////////////
	let mouse = {
	  down: false,
	  x: 0,
	  y: 0
	};
	canvas.addEventListener("mousemove", event => {
	  mouse.x = event.clientX;
	  mouse.y = event.clientY;
	});
	canvas.addEventListener("mousedown", event => {
	  mouse.down = true;
	});
	canvas.addEventListener("mouseup", event => {
	  mouse.down = false;
	});

	function xor(a, b) {
		if ((a || b) && !(a && b))
			return true;
		else
			return false;
	}

	let road = {
		pos: {
			x: -10,
			y: 0,
			z: 0,
		},
		clr: new Color (60,60,75),
		track: {
			clr: new Color(80,80,20),
		},
	}

	let car = { // init player init car
		pos: {
			x: 3.75,
			y: 0,
			h: .5,
		},
		vel: {
			x: 0,
		},
		siz: {
			w: 1,
			l: 2,
		},
		clr: new Color(90,30,15),
		whl: {
			clr: new Color (26,25,29),
			dir: 0,
		},
		draw: function() {
			ctx.fillStyle = "#111111";
			
			var whl2 = Shape.Cylinder(new Point(car.pos.y - car.siz.l/2, car.pos.x - car.siz.w/2 + .1, -.4), .25, 4, .1);
			iso.add(whl2.rotateX(Point(car.pos.y, car.pos.x, 0), Math.PI / 2).translate(0, 0, 1.1)
					.rotateY(Point(car.pos.y - car.siz.w, car.pos.x + 888888, 1.5), Math.PI * dist / 3.825)
					.rotateZ(Point(car.pos.y - 1, car.pos.x -.25, 0), car.whl.dir), car.whl.clr);
			
			// var whl3 = Shape.Cylinder(new Point(car.pos.y + car.siz.l/2 - .6, car.pos.x - car.siz.w/2 + .1, -.4), .25, 4, .1);
			// iso.add(whl3.rotateX(Point(car.pos.y, car.pos.x, 0), Math.PI / 2).translate(0, 0, 1.1), car.whl.clr);
			
			// iso.add(Shape.Prism(new Point(car.pos.y, car.pos.x, .2), // 000
			// 					car.siz.l, car.siz.w, car.siz.h), car.clr);
			iso.add(Shape.Prism(new Point(car.pos.y + car.siz.l*.7, car.pos.x, .2), // 000
								car.siz.l*.2 + car.siz.h*.4, car.siz.w, car.siz.h*.1+.2), car.clr);
			iso.add(Shape.Prism(new Point(car.pos.y, car.pos.x, .2), // 000
								car.siz.l*.7, car.siz.w, car.siz.h), car.clr);
			
			var whl1 = Shape.Cylinder(new Point(car.pos.y, car.pos.x + car.siz.w/2 + .1, -.4), .25, 4, .1);
			iso.add(whl1.rotateX(Point(car.pos.y, car.pos.x, 0), Math.PI / 2).translate(0, 0, 1.1)
					.rotateY(Point(car.pos.y, car.pos.x + car.siz.w/2 + .1, .5), Math.PI * dist / 3.825)
					.rotateZ(Point(car.pos.y, car.pos.x -.25, 0), car.whl.dir), car.whl.clr);

			var whl4 = Shape.Cylinder(new Point(car.pos.y + car.siz.l - .6, car.pos.x + car.siz.w/2 + .1, -.4), .25, 4, .1);
			iso.add(whl4.rotateX(Point(car.pos.y, car.pos.x, 0), Math.PI / 2).translate(0, 0, 1.1)
					.rotateY(Point(car.pos.y + car.siz.l - .6 , car.pos.x + 888888, .5), Math.PI * dist / 3.825)
					.rotateZ(Point(car.pos.y + car.siz.l - .6, car.pos.x -.25, 0), car.whl.dir), car.whl.clr);
		},
	}

	let info = {
		modes: [mouse, keys],
		mode: 1,
		siz: {
			r: canvas.width/20,
		},
		pos: {
			x: canvas.width - canvas.width/20 - 20,
			y: canvas.height - canvas.width/20 - 20,
		},
		clr: ["#7aaaee", "#2233aa"],
		draw(clr = 0) {
			ctx.beginPath();
			ctx.arc(info.pos.x, info.pos.y, info.siz.r, 0, Math.PI*2);
			ctx.fillStyle = info.clr[clr];
			ctx.fill();
			ctx.fillStyle = "#c0c0c0c0";
			ctx.stroke();
			ctx.fillRect(info.pos.x, info.pos.y, 5, 5);
		},
		hovering() {
			if (Math.sqrt((mouse.x - info.pos.x)*(mouse.x - info.pos.x) +
						  (mouse.y - info.pos.y)*(mouse.y - info.pos.y)) < info.siz.r)
				return 1;
			else
				return 0;
		},
		modeChange() {
			if (keys[16]) {
				if (!tab)
					info.mode = Math.abs(info.mode - 1);
				tab = true;
			} else
				tab = false;
		}
	}

	class Cone {
		constructor(posX = rand()*6 - 1.5, w, h, clr = coneOrange) {
			enemTimer += 5;
			this.posX = posX;
			this.posY = canvas.width/70;
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
		constructor(posX = rand()*6 - 1.5, w, h, drk) {
			enemTimer += 10;
			this.posX = posX;
			this.posY = canvas.width/70;
			this.w = w;
			this.h = h;
			this.clr = new Color(skinColor.r/drk, skinColor.g/drk, skinColor.b/drk);
			this.dir = rand()*1.3 - .65;
		};
		draw() {
			iso.add(Shape.Cylinder(Point(this.posY + this.w/2, this.posX + this.w*1.5/5, 2),
								  this.w/17, 30, this.h*.2), this.clr);
			iso.add(Shape.Cylinder(Point(this.posY + this.w/2, this.posX + this.w*3.5/5, 2),
								  this.w/17, 30, this.h*.2), this.clr);
			iso.add(Shape.Prism(Point(this.posY + this.w/5, this.posX + this.w/5, 2 + this.h*.2),
								this.w*3/5, this.w*3/5, this.h*.25), this.clr);
			iso.add(Shape.Cylinder(Point(this.posY + this.w/5 + this.w*3.5/10 ,
										 this.posX + this.w/5, this.h*.2 + 2),
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
			this.posY += vel;
			if (this.posX >= 5.5 - this.w)
				this.dir = Math.abs(this.dir);
			if (this.posX <= -0.5 - this.w)
				this.dir = -Math.abs(this.dir);
			this.posX += vel*2 * this.dir;
		};
	};
	class Driver {
		constructor(posX = rand()*6 - 1.5, w, l, h) {
			enemTimer += 8;
			this.posX = posX;
			this.posY = canvas.width/70 + 5;
			this.velY = .002;
			this.w = w;
			this.l = l;
			this.h = h;
			this.clr = new Color (rand()*150, rand()*150, rand()*150);
		};
		draw() {
			iso.add(Shape.Prism(Point(this.posY, this.posX, 2),
						    this.l, this.w, this.h), this.clr);
			ctx.fillStyle = "#dacf10";
			let a = canvas.height/(canvas.width/405) - (this.posX + 1.3)*67.5;
			let b = 0;
			if (a < 10) {
				b = Math.abs(a)*1.2//(1+Math.cos(Math.PI/3));
				a = 10;
			}
			ctx.fillRect(canvas.width - b - 85, a, 75, 75);
		};
		updt(vel) {
			this.posY += vel - this.velY;
			this.velY += .008;
		};
	};

	function drawClass(arr) {
		for (let obj = arr.length - 1; obj >= 0 ; obj--) {
			arr[obj].draw();
			if (car.pos.x < arr[obj].posX + arr[obj].w + 1.8499 &&
				car.pos.y <= arr[obj].posY + arr[obj].w + 2 &&
				car.pos.y + car.siz.l >= arr[obj].posY)
				car.draw();
		}
	}

	function updtClass(arr) {
		for (let obj = 0; obj < arr.length; obj++) {
			if (arr[obj].posY <= -canvas.width/70) {
				arr.splice(obj, 1);
				continue;
			}
			arr[obj].updt(mps); // check for crash
			if (car.pos.x < arr[obj].posX + arr[obj].w + 2 &&
				car.pos.x + car.siz.w > arr[obj].posX + 2 &&
				car.pos.y <= arr[obj].posY + arr[obj].w + 2 &&
				car.pos.y + car.siz.l >= arr[obj].posY + 2
			   ) {
				maxSpeed = Math.abs(mps*10).toFixed(3);
				mps = 0; // CRASH!
			}
		}
	}

	// misc.
	const coneOrange = new Color(200, 110, 20);
	const skinColor = new Color(210, 165, 60);

	let rand = Math.random;
	let enems = [];
	let enemFreq = 90;
	let enemTimer = 0;
	let dist = 0; // distance travelled
	let mps = -0; // rate of change of distance;
	let secs = 0;
	let score = 0;
	let maxSpeed = 0;
	let tab = false;
	let mouseDown = false;

	////////////////////////// CYCLE /////////////////////////////
	function cycle() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		car.siz.h = .35 + .15 * Math.abs(Math.cos(dist));

		if (mps != 0) {
			mps = 20/(secs/60 + 150) - .2;
			dist += mps;

			if (info.mode === 0) { // keyboard controlled movement
				if (keys[65] || keys[37]) { // left (a)
					if (car.pos.x < 6.4499999999999999)
						car.vel.x = .15;
					else
						car.pos.x = 6.5;
				}
				if (keys[68] || keys[39]) { // right (d)
					if (car.pos.x > .65000000000000010)
						car.vel.x = -.15;
					else
						car.pos.x = .5;
					if (keys[65] || keys[37])
						car.vel.x = 0;
				}
			} else if (info.mode === 1) { // mouse controlled movement
				const a = -mouse.y/100 -mouse.x/100 + canvas.width/150 + canvas.height/150;
				car.whl.dir = -(car.pos.x - a) * Math.PI / 1; // turning wheels
				car.pos.x = a;
				if (car.pos.x < .65)
					car.pos.x = .65;
				else if (car.pos.x > 6.5)
					car.pos.x = 6.5;
			}

			// init enems
			enemFreq = Math.floor(90/(secs/270 + 1) + 45)
			if (secs >= enemTimer) {
				let enemType = Math.ceil(rand()*3);
				switch (enemType) {
					case 0:
					case 1: // cones
						enems.push(new Cone(rand()*6 - 1.5, 1, 1.15));//1 + rand()));
						break;
					case 2: // people
						enems.push(new Pers(rand()*6 - 1.5, 1, 2, rand()*1 + 1));
						break;
					case 3: // drivers
						enems.push(new Driver(rand()*6 - 1.5, 1, 2, .5));
						break;
				}
				enemTimer = secs + enemFreq;
			}
			car.pos.x += car.vel.x
		}

		// draw road
		iso.add(Shape.Prism(new Point(road.pos.x, road.pos.y, road.pos.z),
							40, 7, .5), road.clr);
		for (i = 0; i <= 20; i++)
			iso.add(Shape.Prism(new Point(i * 4.5 + dist % 4.5 - 10, 4, 0),
						  1.5, .5, 0), road.track.clr);

		car.draw();
		updtClass(enems);
		drawClass(enems);

		ctx.fillStyle = "#af9f10";
		ctx.font = canvas.width/30 + "px Courier";
		ctx.fillText("Distance: " + Math.abs(dist).toFixed(1) + "m", 10, canvas.width/20);
		ctx.fillText("Speed: " + Math.abs(mps*10).toFixed(3) + "mps", 10, canvas.width/11.5);
		ctx.font = canvas.width/17 + "px Courier";
		ctx.fillStyle = "#ea4324";
		let a = "Score: " + Math.ceil(Math.abs(dist) * 1.234) + "m"
		ctx.fillText(a, canvas.width - a.length*canvas.width/20, canvas.height - 10);

		secs += 1;
		car.vel.x = 0;
				
		if (mps === 0 && road.pos.x === -10)
			requestAnimationFrame(gameOver)
		else
			requestAnimationFrame(cycle);

	}

	function start() {
		if (keys[32] || mouse.down) {
			score = 0;
			enems = [];
			enemFreq = 90;
			enemTimer = 0;
			dist = 0;
			mps = -.09;
			secs = 0;
			road1.pos.x = -10;
			document.getElementById("dist").innerHTML = "";
			document.getElementById("spd").innerHTML = "";
			document.getElementById("title").innerHTML = "";
			if (mouse.down) {
				if (info.hovering()) {
					mouseDown = true;
					requestAnimationFrame(infoScreen);
					return;
				} else
					info.mode = 1;
			}
			else if (keys[32])
				info.mode = 0;
			requestAnimationFrame(cycle);
			return;
		}
		info.modeChange();
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		info.draw(info.hovering());

		iso.add(Shape.Prism(new Point(road.pos.x, road.pos.y, road.pos.z),
							40, 7, .5), road.clr);
		for (i = 0; i <= 20; i++)
			iso.add(Shape.Prism(new Point(i * 4.5 + dist % 4.5 - 10, 4, 0),
						  1.5, .5, 0), road.track.clr);
		document.getElementById("title").innerHTML = "B L O C K Y<br>T H E<br>C A R";
		ctx.font = "35px courier";
		ctx.fillStyle = "#442414"
		if (-dist % 3.5 <= 1.725)
			ctx.fillText("click to start", canvas.width/2 - 35*3.5,
						 canvas.height*9/10)
		dist-=.05;
		if (info.hovering() && mouse.down) {
			requestAnimationFrame(infoScreen);
		} else
			requestAnimationFrame(start);
	}

	let road1 = {
		pos: {
			x: -10,
			z: canvas.height/140,
		},
		vel: .5,
		acc: .0001,
	}

	function gameOver() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		info.modeChange();
		road1.pos.z = canvas.height/140;

		ctx.fillStyle = "#747489";
		ctx.fillRect(0, canvas.height, canvas.width, -road1.pos.x*40);
		info.draw(info.hovering());

		iso.add(Shape.Prism(new Point(road1.pos.x, 0, road1.pos.z), -20, 2, .15), road.clr);
		for (i = 0; i <= 5; i++)
			iso.add(Shape.Prism(new Point(i * 2 + dist % 2 + road1.pos.x - 13, 0, road1.pos.z+1.15),
						  1, .2,.01), road.track.clr);

		iso.add(Shape.Prism(new Point(road1.pos.x, 0, road1.pos.z-3), -20, 2, .15), road.clr);
		for (i = 0; i <= 5; i++)
			iso.add(Shape.Prism(new Point(i * 2 + dist % 2 + road1.pos.x - 13, 0, road1.pos.z-1.85),
						  1, .2, .01), road.track.clr);

		if (road1.pos.x < 5) {
			road1.pos.x += road1.vel;
			road1.vel += road1.acc;
			road1.acc = Math.sqrt(road1.vel + .1)/20;
		} else {
			road1.pos.x = 5;
			ctx.fillStyle = "#905634";
			ctx.font = "30px Courier";
			ctx.fillText("score: ", canvas.width/2.5, canvas.height*7/9);
			ctx.font = "160px Courier";
			ctx.fillText(" " + score, canvas.width/2.5, canvas.height*7/9);
			document.getElementById("dist").style.top = canvas.height - (road1.pos.z + 3)*72 + "px";
			document.getElementById("dist").style.left = canvas.width/2 - 2*70.0 + "px";
			document.getElementById("dist").innerHTML = "distance: " + Math.abs(dist).toFixed(1) + "m";
			document.getElementById("spd").style.top = canvas.height - road1.pos.z*72 + "px";
			document.getElementById("spd").style.left = canvas.width/2 - 2*70.0 + "px";
			document.getElementById("spd").innerHTML = "speed: " + maxSpeed + "mps";
			if (score < Math.abs(dist))
				score += 1;
			else if (score < Math.abs(dist) * 1.234)
				score += 1;
		}
		if (keys[32] || mouse.down) {
			requestAnimationFrame(start);
		} else
			requestAnimationFrame(gameOver);
	}
	function infoScreen() {
		document.getElementById("inf").style.fontSize = "35px";
		if (info.hovering() && mouse.down && !mouseDown) {
			document.getElementById("inf").style.fontSize = "0px";
			requestAnimationFrame(start)
			mouseDown = true;
		} else {
			requestAnimationFrame(infoScreen);
			mouseDown = false;
		}
	}

	requestAnimationFrame(start);
}
window.onload = function() {
	blockyTheCar();
}
